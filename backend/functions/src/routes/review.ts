import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { logger } from "firebase-functions";
import { isAuthenticated } from "../middleware/authentication";
import { FirebaseAuthError } from "firebase-admin/auth";
import { ApplicationReviewData, ApplicationReviewDataSchema } from "../models/appReview";
import { UserProfile } from "../models/user";
import { CollectionReference } from "firebase-admin/firestore";

const router = Router();

const REVIEW_DATA_COLLECTION = "application-reviews"
const USER_COLLECTION = "users"

router.post("/submit", [isAuthenticated, hasRoles, validateSchema(ApplicationReviewDataSchema)], async (req: Request, res: Response) => {
    try {
        const reviewResponse = req.body as ApplicationReviewData;

        logger.info(`${req.token?.email} is submitting review data`)

        // make connections to database
        const reviewDataCollection = db.collection(REVIEW_DATA_COLLECTION) as CollectionReference<ApplicationReviewData>
        const userCollection = db.collection(USER_COLLECTION) as CollectionReference<UserProfile>

        // verify that the reviewer exists
        const reviewerDoc = await userCollection.doc(reviewResponse.reviewerId).get()
        if (!reviewerDoc.exists) {
            res.status(400).send("Reviewer does not exist")
            return
        }

        const docRef = reviewDataCollection.doc();

        const reviewWithId: ApplicationReviewData = {
            ...reviewResponse,
            id: docRef.id,
        };

        await docRef.create(reviewWithId);

        logger.info(`Successfully created reviewData doc for applicant:${reviewResponse.applicantId}`)

        res.status(200).send(reviewWithId);
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
        const reviewId = req.params.id as string

        logger.info(`${req.token?.email} is getting review data for ${reviewId}`)

        // make connections to database
        const reviewDataCollection = db.collection(REVIEW_DATA_COLLECTION) as CollectionReference<ApplicationReviewData>
        const userCollection = db.collection(USER_COLLECTION) as CollectionReference<UserProfile>

        const reviewDoc = await reviewDataCollection.doc(reviewId).get()

        // verify that the review exists
        if (!reviewDoc.exists) {
            res.status(400).send("Review does not exist")
            return
        }

        const reviewDocData = reviewDoc.data() as ApplicationReviewData
        res.status(200).send(reviewDocData)
    } catch (error) {

        if (error instanceof FirebaseAuthError) {
            res.status(500).send(error.message)
        } else {
            res.status(500).send()
        }
    }
});

export default router;
