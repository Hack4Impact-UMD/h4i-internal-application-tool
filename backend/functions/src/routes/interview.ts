import { Router, Request, Response } from "express";
import { db } from "../index";
import { logger } from "firebase-functions";
import { hasRoles, isAuthenticated } from "../middleware/authentication";
import { validateSchema } from "../middleware/validation";
import { FirebaseAuthError } from "firebase-admin/auth";
import { CollectionReference } from "firebase-admin/firestore";
import { InterviewData, interviewSchema, updateInterviewSchema, ApplicationInterviewData, ApplicationInterviewDataSchema } from "../models/appInterview";

const router = Router();
const INTERVIEW_COLLECTION = db.collection("interview-data") as CollectionReference<InterviewData>;
const INTERVIEW_DATA_COLLECTION = "application-interviews"

// Create a new interview
router.post("/", [isAuthenticated, hasRoles(["reviewer", "super-reviewer"]), validateSchema(interviewSchema)], async (req: Request, res: Response) => {
    const input = req.body;
    const timestamp = new Date().toISOString();

    try {
        const interviewId = `${input.reviewerId}_${input.applicationId}`;
        const newInterview: InterviewData = {
            ...input,
            id: interviewId,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        const docRef = db.collection(INTERVIEW_COLLECTION).doc(interviewId);
        const existing = await docRef.get();

        if (existing.exists) {
            logger.warn(`Interview already exists for ID: ${interviewId}`);
            return res.status(400).send("Interview already exists for this reviewer-application pair.");
        }

        await docRef.set(newInterview);
        logger.info(`Created Interview with ID: ${interviewId}`);

        return res.status(201).send(newInterview);
    } catch (error) {
        logger.error("Failed to create interview:", error);
        return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// Update an existing interview
router.put("/:id", [isAuthenticated, hasRoles(["reviewer", "super-reviewer"]), validateSchema(updateInterviewSchema)], async (req: Request, res: Response) => {
    const interviewId = req.params.id;
    const updates = req.body;

    try {
        const docRef = db.collection(INTERVIEW_COLLECTION).doc(interviewId);
        const existing = await docRef.get();

        if (!existing.exists) {
            logger.warn(`Interview not found for ID: ${interviewId}`);
            return res.status(404).send("Interview not found.");
        }

        const updatedInterview = {
            ...existing.data(),
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await docRef.update(updatedInterview);
        logger.info(`Updated Interview with ID: ${interviewId}`);

        return res.status(200).send(updatedInterview);
    } catch (error) {
        logger.error("Failed to update interview:", error);
        return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// Delete an interview
router.delete("/:id", [isAuthenticated, hasRoles(["reviewer", "super-reviewer"])], async (req: Request, res: Response) => {
    const interviewId = req.params.id;

    try {
        const docRef = db.collection(INTERVIEW_COLLECTION).doc(interviewId);
        const existing = await docRef.get();

        if (!existing.exists) {
            logger.warn(`Interview not found for ID: ${interviewId}`);
            return res.status(404).send("Interview not found.");
        }

        await docRef.delete();
        logger.info(`Deleted Interview with ID: ${interviewId}`);

        return res.status(200).send({ message: "Interview deleted successfully" });
    } catch (error) {
        logger.error("Failed to delete interview:", error);
        return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});



// Create new interviewData
router.post("/submit", [isAuthenticated, hasRoles(["reviewer", "super-reviewer"]), validateSchema(ApplicationInterviewDataSchema)], async (req: Request, res: Response) => {
    try {
        const interviewResponse = req.body as ApplicationInterviewData;

        logger.info(`${req.token?.email} is submitting interview data`)

        // make connections to database
        const interviewDataCollection = db.collection(INTERVIEW_DATA_COLLECTION) as CollectionReference<ApplicationInterviewData>

        const docRef = interviewDataCollection.doc();

        const interviewWithId: ApplicationInterviewData = {
            ...interviewResponse,
            id: docRef.id,
        };

        await docRef.create(interviewWithId);

        logger.info(`Successfully created interviewData doc for applicant:${interviewResponse.applicantId}`)

        res.status(200).send(interviewWithId);
    } catch (error) {
        if (error instanceof FirebaseAuthError) {
            res.status(500).send(error.message)
        } else {
            res.status(500).send()
        }
    }
});

// Get existing interviewData
router.get("/:id", [isAuthenticated, hasRoles(["reviewer", "super-reviewer"])], async (req: Request, res: Response) => {
    try {
        const interviewId = req.params.id as string

        logger.info(`${req.token?.email} is getting interview data for ${interviewId}`)

        // make connections to database
        const interviewDataCollection = db.collection(INTERVIEW_DATA_COLLECTION) as CollectionReference<ApplicationInterviewData>

        const interviewDoc = await interviewDataCollection.doc(interviewId).get()

        // verify that the review exists
        if (!interviewDoc.exists) {
            res.status(400).send("Review does not exist")
            return
        }

        const interviewDocData = interviewDoc.data() as ApplicationInterviewData
        res.status(200).send(interviewDocData)
    } catch (error) {
        if (error instanceof FirebaseAuthError) {
            res.status(500).send(error.message)
        } else {
            res.status(500).send()
        }
    }
});

export default router; 
