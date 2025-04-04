import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { ApplicationResponse, AppResponseForm, appResponseFormSchema } from "../models/appResponse";
import { CollectionReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

const router = Router();

// add isAuthenticated here?
router.post("/submit", [validateSchema(appResponseFormSchema)], async (req: Request, res: Response) => {
  try {
    const applicationResponse = req.body as AppResponseForm;

    // initialize connections to collections
    // NOTE: THESE COLLECTION NAMES MAY NOT BE THE ONES USED IN FINAL PRODUCTION
    const applicationCollection = db.collection("applications") as CollectionReference<ApplicationResponse>;
    const applicationFormCollection = db.collection("applicationForms");

    // check that the correct user is updating the application
    const applicationDoc = await applicationCollection.doc(applicationResponse.applicationResponseId).get();
    const formattedApplicationDoc = applicationDoc.data() as ApplicationResponse;
    if (formattedApplicationDoc.userId !== applicationResponse.userId) {
      return res.status(403).send("User not authorized to submit this application");
    }

    // Check that the response is submitted before the due date specified by the application form
    const applicationFormDoc = await applicationFormCollection.doc(applicationResponse.applicationFormId).get();
    const applicationFormDocData = applicationFormDoc.data();

    const currentTime = new Date();
    const dueDate = applicationFormDocData!!.dueDate as FirebaseFirestore.Timestamp;
    logger.info(`Current Time: ${currentTime}, Due Date: ${dueDate.toDate()}`)
    logger.info(`Current Time toString: ${currentTime.toString()}, Due Date toString: ${dueDate.toDate().toString()}`)
    if (currentTime > dueDate.toDate()) {
      return res.status(400).send("Submission deadline has passed");
    }


    // Proceed with updating submission status
    await applicationCollection.doc(applicationResponse.applicationResponseId).update({
      status: "submitted",
      dateSubmitted: currentTime.toISOString(),
    });

    return res.status(200).send("Application submitted successfully");
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).send("Internal server error.");
  }
})


export default router;
