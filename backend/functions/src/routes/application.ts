import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { ApplicationResponse, ApplicationResponseInput, ApplicationResponseSchema, ApplicationStatus, appResponseFormSchema } from "../models/appResponse";
import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { hasRoles, isAuthenticated } from "../middleware/authentication";
import { ApplicationForm } from "../models/appForm";
import { PermissionRole } from "../models/appReview";
// import * as admin from "firebase-admin"

const router = Router();

const APPLICATION_RESPONSE_COLLECTION = "application-responses"
const APPLICATION_FORMS_COLLECTION = "application-forms"

interface QuestionMetadata {
  optional: boolean;
  minimumWordCount?: number;
  maximumWordCount?: number;
}

function validateResponses(applicationResponse: ApplicationResponse, applicationForm: ApplicationForm) {
  const errors: string[] = [];

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

  // validate each response
  for (const section of applicationResponse.sectionResponses) {
    const formSection = applicationForm.sections.find(s => s.sectionId == section.sectionId);
    if (!formSection) return ["Invalid form section" + section.sectionId];

    if (formSection.forRoles) {
      if (formSection.forRoles.filter(role => applicationResponse.rolesApplied.includes(role)).length == 0) {
        continue;
      }
    }

    for (const question of section.questions) {
      const metaData = formQuestions.get(question.questionId);
      if (!metaData) {
        errors.push(`Question ${question.questionId} has no metadata`)
        continue;
      }

      if (metaData?.optional === false && question.response.length == 0) {
        errors.push(`Question ${question.questionId} is required`)
      }

      const responseWordsArr = question.response.toString().split(" ")
      if (metaData?.maximumWordCount && responseWordsArr.length > metaData?.maximumWordCount ||
        metaData?.minimumWordCount && responseWordsArr.length < metaData?.minimumWordCount
      ) {
        errors.push(`Question ${question.questionId}: word count (${responseWordsArr.length}) is out of range [${metaData.minimumWordCount || 0}, ${metaData.maximumWordCount || "∞"}]`);
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
      return res.status(400).send("Submission deadline has passed");
    }

    const errors = validateResponses(applicationResponse, applicationFormDocData!)
    if (errors.length != 0) {
      return res.status(400).send(errors.join(", "))
    }

    // Proceed with updating submission status
    const newApp = {
      ...applicationResponse,
      status: "submitted",
      dateSubmitted: Timestamp.now(),
    }
    await applicationResponseCollection.doc(applicationResponse.id).update(newApp);

    return res.status(200).json(newApp).send();
  } catch (error) {
    logger.error("Error submitting application:", error);
    return res.status(500).send("Internal server error.");
  }
})

router.get("/", (_, res) => {
  res.send("Hello")
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
