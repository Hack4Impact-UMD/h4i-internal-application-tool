import { Router, Request, Response } from "express";
import { db } from "../index";
import { logger } from "firebase-functions";
import { isAuthenticated, hasRoles } from "../middleware/authentication";
import { validateSchema } from "../middleware/validation";
import { CollectionReference } from "firebase-admin/firestore";
import { ConfirmationStatus, ConfirmationStatusSchema } from "../models/confirmation";
import { InternalApplicationStatus } from "../models/appStatus";

const router = Router();

// Firestore collections
const CONFIRMATION_COLLECTION = db.collection("decision-status") as CollectionReference<ConfirmationStatus>; //confirmation objects
const APP_STATUS_COLLECTION = db.collection("app-status") as CollectionReference<InternalApplicationStatus>; //["acecpted","waitlisted","denied"]


router.post(
  "/decision",
  [isAuthenticated, hasRoles(["applicant"]), validateSchema(ConfirmationStatusSchema)],
  async (req: Request, res: Response) => {
    try {
        console.log("Request received:", req.body); // Log the incoming request bodyc
      const input = req.body as ConfirmationStatus;
      const { responseId, userId } = input;
      // Check if confirmation already exists for this responseId
      const existingConfirmation = await CONFIRMATION_COLLECTION
        .where("responseId", "==", responseId)
        .get();
        console.log("Existing confirmation query result:", existingConfirmation.docs); // Log query result
      if (!existingConfirmation.empty) {
        logger.warn(`Confirmation already exists for responseId: ${responseId}`);
        return res.status(400).send("Confirmation already exists for this responseId.");
      }

      // Look up applicant’s internal decision in app-status
      const decisionDocs = await APP_STATUS_COLLECTION.where("responseId", "==", responseId).get();

      if (decisionDocs.empty) {
        logger.warn(`No app-status record found for responseId: ${responseId}`);
        return res.status(404).send("No decision found for this response.");
      }

      const decision = decisionDocs.docs[0].data();

      if (decision.status !== "accepted") {
        logger.warn(`User ${userId} attempted to confirm but status was not accepted.`);
        return res.status(403).send("You cannot confirm because you were not accepted.");
      }

      //  Create ConfirmationStatus document
      const confirmationId = `${responseId}_${userId}`;
      const docRef = CONFIRMATION_COLLECTION.doc(confirmationId);

      await docRef.set(input);

      logger.info(`Created confirmation for responseId: ${responseId}`);
      return res.status(200).send({ message: "Confirmation recorded successfully." });

    } catch (error) {
      logger.error("Error creating confirmation:", error);
      return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export default router;
