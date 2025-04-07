import { Router, Request, Response } from "express";
import { db } from "../index";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { isAuthenticated } from "../middleware/authentication";
import { validateSchema } from "../middleware/validation";
import { CollectionReference } from "firebase-admin/firestore";
import {
  ApplicationResponse,
  newApplicationResponseSchema,
  ApplicationResponseInput,
} from "../models/appResponse";
import { UserProfile } from "../models/user";

/* eslint new-cap: 0 */
const router = Router();

router.post("/application", [isAuthenticated, validateSchema(newApplicationResponseSchema)], async (req: Request, res: Response) => {
  const input = req.body as ApplicationResponseInput;

  try {
    const newAppResponse: ApplicationResponse = {
      ...input,
      status: "in-progress",
    };

    const appCollection = db.collection("applicationResponses") as CollectionReference<ApplicationResponse>;
    const profileCollection = db.collection("users") as CollectionReference<UserProfile>;

    await appCollection.doc(newAppResponse.id).set(newAppResponse);
    logger.info(`Created ApplicationResponse with ID: ${newAppResponse.id} for user ${newAppResponse.user_id}`);

    const userRef = profileCollection.doc(newAppResponse.user_id);

    await userRef.set(
      {
        activeApplications: admin.firestore.FieldValue.arrayUnion(newAppResponse.id),
      },
      { merge: true }
    );

    res.status(201).send(newAppResponse);
  } catch (error) {
    logger.error("Failed to create application response:", error);
    res.status(400).send(error instanceof Error ? error.message : "Unknown error");
  }
}
);

router.put("/application/:id", [isAuthenticated, validateSchema(newApplicationResponseSchema.partial())], async (req: Request, res: Response) => {
  const applicationId = req.params.id;
  const currentUserId = req.token?.uid;

  try {
    const appCollection = db.collection("applicationResponses") as CollectionReference<ApplicationResponse>;
    const docRef = appCollection.doc(applicationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      logger.warn(`ApplicationResponse ${applicationId} not found`);
      return res.status(404).send("Application response not found");
    }

    const existingResponse = docSnap.data() as ApplicationResponse;

    if (existingResponse.user_id !== currentUserId) {
      logger.warn(`Unauthorized update attempt by ${currentUserId} on response ${applicationId}`);
      return res.status(403).send("You are not authorized to update this application response");
    }

    if (existingResponse.status === "submitted") {
      logger.warn(`Attempt to update submitted response ${applicationId}`);
      return res.status(400).send("Cannot update a submitted application response");
    }

    if (existingResponse.status === "reviewed") {
      logger.warn(`Attempt to update reviewed response ${applicationId}`);
      return res.status(400).send("Cannot update a reviewed application response");
    }

    const updatedFields = req.body as Partial<ApplicationResponse>;

    delete updatedFields.id;
    delete updatedFields.user_id;
    delete updatedFields.status;

    await docRef.update(updatedFields);
    logger.info(`Updated ApplicationResponse ${applicationId}`);

    return res.status(200).send({ message: "Application response updated successfully" });
  } catch (error) {
    logger.error("Error updating application response:", error);
    return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
}
);

export default router;