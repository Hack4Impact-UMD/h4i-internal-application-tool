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

router.post("/submit", [isAuthenticated, validateSchema(ApplicationReviewDataSchema)], async (req: Request, res: Response) => {
  try {
    const reviewResponse = req.body as ApplicationReviewData;

    logger.info(`${req.token?.email} is submitting a review!`)

    // make connections to database
    const reviewDataCollection = db.collection(REVIEW_DATA_COLLECTION) as CollectionReference<ApplicationReviewData>
    const userCollection = db.collection(USER_COLLECTION) as CollectionReference<UserProfile>

    // verify that the reviewer exists
    const reviewerDoc = await userCollection.doc(reviewResponse.reviewerId).get()
    if (!reviewerDoc.exists) {
      res.status(400).send("Reviewer does not exist")
      return
    }

    // verify that the reviewer had role of reviewer or super-reviewer
    const reviewerDocData = reviewerDoc.data() as UserProfile
    if (reviewerDocData.role !== "reviewer" && reviewerDocData.role !== "super-reviewer") {
      res.status(403).send("User is not a reviewer or super reviewer")
      return
    }

    const user: UserProfile = {
      ...reviewResponse,
      id:
    }

    await reviewDataCollection.doc().create(reviewResponse)

    logger.info(`Successfully created reviewData doc for applicant:${reviewResponse.applicantId}`)

    res.status(200).send(reviewResponse);
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      res.status(500).send(error.message)
    } else {
      res.status(500).send()
    }
  }
});

router.get("/:id", [isAuthenticated], async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id as string

    logger.info(`${req.token?.email} is getting review data for ${reviewId}`)

    // make connections to database
    const reviewDataCollection = db.collection(REVIEW_DATA_COLLECTION) as CollectionReference<ApplicationReviewData>
    const userCollection = db.collection(USER_COLLECTION) as CollectionReference<UserProfile>

    // verify that the user has role of reviewer or super-reviewer
    const userDoc = await userCollection.doc(req.token?.uid!).get()
    const userDocData = userDoc.data() as UserProfile
    if (userDocData.role !== "reviewer" && userDocData.role !== "super-reviewer") {
      res.status(403).send("User is not a reviewer or super reviewer")
      return
    }

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
