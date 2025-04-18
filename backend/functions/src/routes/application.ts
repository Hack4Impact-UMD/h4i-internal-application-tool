import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { ApplicationResponse, appResponseFormSchema } from "../models/appResponse";
import { CollectionReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { hasRoles, isAuthenticated } from "../middleware/authentication";
import { ApplicationForm } from "../models/appForm";
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
    const applicationDoc = await applicationResponseCollection.doc(applicationResponse.applicationResponseId).get();
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
    await applicationResponseCollection.doc(applicationResponse.applicationResponseId).update({
      status: "submitted",
      dateSubmitted: currentTime.toISOString(),
    });

    return res.status(200).json(applicationResponse).send();
  } catch (error) {
    logger.error("Error submitting application:", error);
    return res.status(500).send("Internal server error.");
  }
})


export default router;
