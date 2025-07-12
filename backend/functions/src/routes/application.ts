import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { ApplicationResponse, ApplicationResponseInput, ApplicationResponseSchema, ApplicationStatus, appResponseFormSchema, QuestionResponse, QuestionType } from "../models/appResponse";
import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { hasRoles, isAuthenticated } from "../middleware/authentication";
import { ApplicationForm } from "../models/appForm";
import { PermissionRole } from "../models/appReview";
import { InternalApplicationStatus, ReviewStatus } from "../models/appStatus";
import { v4 as uuidv4 } from "uuid"
// import * as admin from "firebase-admin"

const router = Router();

const APPLICATION_RESPONSE_COLLECTION = "application-responses"
const APPLICATION_FORMS_COLLECTION = "application-forms"
const APPLICATION_STATUS_COLLECTION = "app-status"

interface QuestionMetadata {
  optional: boolean;
  minimumWordCount?: number;
  maximumWordCount?: number;
}

type ValidationError = {
  sectionId: string
  questionId: string,
  message: string
}

function validateResponses(applicationResponse: ApplicationResponse, applicationForm: ApplicationForm): ValidationError[] {
  const errors: ValidationError[] = [];

  // fill formQuestions map
  const formQuestions = new Map<string, QuestionMetadata>(
    applicationForm.sections.flatMap(section =>
      section.questions.map(q => [
        q.questionId,
        {
          optional: q.optional,
          minimumWordCount: q.minimumWordCount,
          maximumWordCount: q.maximumWordCount
        }
      ])
    )
  );

  if (applicationResponse.rolesApplied.length == 0) {
    let roleSelectQuestion: QuestionResponse | undefined;
    let sectionId: string | undefined;
    for (const section of applicationResponse.sectionResponses) {
      roleSelectQuestion = section.questions.find(q => q.questionType == QuestionType.RoleSelect);
      sectionId = section.sectionId
      if (roleSelectQuestion) break;
    }

    return [
      {
        questionId: roleSelectQuestion!.questionId,
        sectionId: sectionId!,
        message: "You must apply for at least one role"
      }
    ]
  }

  // validate each response
  for (const section of applicationResponse.sectionResponses) {
    const formSection = applicationForm.sections.find(s => s.sectionId == section.sectionId);
    if (!formSection) {
      throw new Error("Invalid form section: " + section.sectionId)
    }

    if (formSection.forRoles) {
      if (formSection.forRoles.filter(role => applicationResponse.rolesApplied.includes(role)).length == 0) {
        continue;
      }
    }

    for (const question of section.questions) {
      const metaData = formQuestions.get(question.questionId);
      if (!metaData) {
        logger.error(`Question ${question.questionId} has no metadata`)
        continue;
      }

      if (metaData?.optional) continue; // no need for validation

      if (metaData?.optional === false && question.response.length == 0) {
        errors.push({
          sectionId: section.sectionId,
          questionId: question.questionId,
          message: "This question is required"
        })
      }

      const responseWordsArr = question.response.toString().trim().split(" ")
      if (metaData?.maximumWordCount && responseWordsArr.length > metaData?.maximumWordCount ||
        metaData?.minimumWordCount && responseWordsArr.length < metaData?.minimumWordCount
      ) {
        errors.push({
          sectionId: section.sectionId,
          questionId: question.questionId,
          message: `Word count ${responseWordsArr.length} is out of range [${metaData.minimumWordCount || 0}, ${metaData.maximumWordCount || "∞"}]`
        });
      }
    }
  }

  return errors
}

router.post("/submit", [isAuthenticated, hasRoles(["applicant"]), validateSchema(appResponseFormSchema)], async (req: Request, res: Response) => {
  try {
    const applicationResponse = req.body as ApplicationResponse;

    logger.info(`${req.token?.email} is submitting an application!`)

    // initialize connections to collections
    const applicationResponseCollection = db.collection(APPLICATION_RESPONSE_COLLECTION) as CollectionReference<ApplicationResponse>;
    const applicationFormCollection = db.collection(APPLICATION_FORMS_COLLECTION) as CollectionReference<ApplicationForm>;
    const statusCollection = db.collection(APPLICATION_STATUS_COLLECTION) as CollectionReference<InternalApplicationStatus>

    // check that the correct user is updating the application
    const applicationDoc = await applicationResponseCollection.doc(applicationResponse.id).get();
    const formattedApplicationDoc = applicationDoc.data() as ApplicationResponse;
    if (formattedApplicationDoc.userId !== req.token?.uid) {
      return res.status(403).send("User not authorized to submit this application");
    }

    // Check that the response is submitted before the due date specified by the application form
    const applicationFormDoc = await applicationFormCollection.doc(applicationResponse.applicationFormId).get();
    const applicationFormDocData = applicationFormDoc.data();

    const currentTime = new Date();
    const dueDate = new Date(applicationFormDocData!.dueDate);
    if (currentTime > dueDate) {
      logger.warn("Submission deadline passed for form:" + applicationFormDocData?.id)
      return res.status(400).send("Submission deadline has passed");
    }

    try {
      const errors = validateResponses(applicationResponse, applicationFormDocData!)

      if (errors.length != 0) {
        logger.warn("Validation errors found for response:" + applicationResponse.id)
        logger.warn(errors)
        return res.status(400).json({
          status: "error",
          validationErrors: errors
        })
      }
    } catch (err) {
      logger.error("Validation error: ")
      logger.error(err)
      res.status(500).send();
    }

    // Proceed with updating submission status
    const newApp = {
      ...applicationResponse,
      status: "submitted",
      dateSubmitted: Timestamp.now(),
    }
    await applicationResponseCollection.doc(applicationResponse.id).update(newApp);

    for (const role of applicationResponse.rolesApplied) {
      logger.info(`creating review status object for response ${applicationResponse.id} and role ${role}`);
      const id = uuidv4()

      const status: InternalApplicationStatus = {
        id: id,
        formId: applicationResponse.applicationFormId,
        responseId: applicationResponse.id,
        role: role,
        status: ReviewStatus.UnderReview,
        isQualified: false
      }

      await statusCollection.doc(status.id).set(status)
    }

    logger.info("Successfully submitted form!")
    logger.info(newApp)

    return res.status(200).json({
      status: "success",
      application: newApp
    });
  } catch (error) {
    logger.error("Error submitting application:", error);
    return res.status(500).send("Internal server error.");
  }
})

router.put("/save/:respId", [isAuthenticated, hasRoles([PermissionRole.Applicant]), validateSchema(ApplicationResponseSchema)], async (req: Request, res: Response) => {
  const input = req.body as ApplicationResponseInput;
  const respId = req.params.respId
  logger.info("Received save request for response ID: ", respId)

  try {
    const newAppResponse: ApplicationResponse = {
      id: input.id,
      applicationFormId: input.applicationFormId,
      userId: req.token!.uid,
      dateSubmitted: Timestamp.now(),
      rolesApplied: input.rolesApplied,
      sectionResponses: input.sectionResponses,
      status: ApplicationStatus.InProgress,
    };

    if (respId != newAppResponse.id) {
      logger.error("Application save: Response ID mismatch")
      res.status(500).send()
      return
    }

    const appCollection = db.collection(APPLICATION_RESPONSE_COLLECTION) as CollectionReference<ApplicationResponse>;

    const existingResp = (await appCollection.doc(newAppResponse.id).get()).data();

    if (!existingResp) {
      logger.warn("Attempt to save a non-existant application: ", newAppResponse.id)
      res.status(400).send()
      return;
    }

    if (existingResp.userId != req.token!.uid) {
      logger.warn(`Unauthorized application save! UID: ${req.token!.uid} vs existing user id in response ${existingResp.userId}`)
      logger.warn(`response id: ${respId}`)
      res.status(403).send();
      return;
    }

    await appCollection.doc(existingResp.id).set(newAppResponse)
    logger.info(`Saved ApplicationResponse with ID: ${newAppResponse.id} for user ${newAppResponse.userId}`);

    res.status(201).send(newAppResponse);
  } catch (error) {
    logger.error("Failed to create application response:", error);
    res.status(400).send(error instanceof Error ? error.message : "Unknown error");
  }
}
);


export default router;
