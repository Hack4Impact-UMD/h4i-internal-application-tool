import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { ApplicationResponse, AppResponseForm, appResponseFormSchema } from "../models/appResponse";
import { CollectionReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { isAuthenticated } from "../middleware/authentication";
import { ApplicationForm } from "../models/appForm";

const router = Router();

const APPLICATION_RESPONSE_COLLECTION = "application-responses"
const APPLICATION_FORMS_COLLECTION = "application-forms"

// add isAuthenticated here?
router.post("/submit", [isAuthenticated, validateSchema(appResponseFormSchema)], async (req: Request, res: Response) => {
  try {
    const applicationResponse = req.body as AppResponseForm;

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
    const dueDate = FirebaseFirestore.Timestamp.fromDate(applicationFormDocData!.dueDate);
    logger.info(`Current Time: ${currentTime}, Due Date: ${dueDate.toDate()}`)
    logger.info(`Current Time toString: ${currentTime.toString()}, Due Date toString: ${dueDate.toDate().toString()}`)
    if (currentTime > dueDate.toDate()) {
      return res.status(400).send("Submission deadline has passed!");
    }

    //TODO: some of the questions in the application form are optional, while some are not.
    //Others also have word count restrictions. Those should also be checked here before finalizing
    //the submission! You can just iterate through all the question responses, find the corresponding
    //question in the form based on the question id and validate any requirements that it has.

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
