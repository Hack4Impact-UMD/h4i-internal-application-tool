import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { logger } from "firebase-functions";
import { isAuthenticated } from "../middleware/authentication";
import { FirebaseAuthError } from "firebase-admin/auth";
import { ApplicationInterviewData, ApplicationInterviewDataSchema } from "../models/appInterview";
import { UserProfile } from "../models/user";
import { CollectionReference } from "firebase-admin/firestore";

const router = Router();

const INTERVIEW_DATA_COLLECTION = "application-interviews"
const USER_COLLECTION = "users"

router.post("/submit", [isAuthenticated, hasRoles, validateSchema(ApplicationInterviewDataSchema)], async (req: Request, res: Response) => {
    try {
        const interviewResponse = req.body as ApplicationInterviewData;

        logger.info(`${req.token?.email} is submitting interview data`)

        // make connections to database
        const interviewDataCollection = db.collection(INTERVIEW_DATA_COLLECTION) as CollectionReference<ApplicationInterviewData>
        const userCollection = db.collection(USER_COLLECTION) as CollectionReference<UserProfile>

        // verify that the reviewer exists
        const interviewerDoc = await userCollection.doc(interviewResponse.interviewerId).get()
        if (!interviewerDoc.exists) {
            res.status(400).send("Interviewer does not exist")
            return
        }

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

router.get("/:id", [isAuthenticated, hasRoles], async (req: Request, res: Response) => {
    try {
        const interviewId = req.params.id as string

        logger.info(`${req.token?.email} is getting interview data for ${interviewId}`)

        // make connections to database
        const interviewDataCollection = db.collection(INTERVIEW_DATA_COLLECTION) as CollectionReference<ApplicationInterviewData>
        const userCollection = db.collection(USER_COLLECTION) as CollectionReference<UserProfile>

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
