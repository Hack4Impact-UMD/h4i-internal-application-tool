import express from "express";
import { db } from "../index";
import * as admin from "firebase-admin";
import {
  ApplicationStatus,
  ApplicantUserProfile,
  ApplicationResponse,
} from "../../../../frontend/src/types/types";

const router = express.Router();

router.post("/submit", async (req, res) => {
    // 404 = not found, 403 = forbidden
    const { userId, applicationId, applicationData } = req.body;

    if (!userId || !applicationId || !applicationData) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
        return res.status(403).json({ error: "Unauthorized access" });
        }

        const user = userDoc.data() as ApplicantUserProfile;

        if (user.role !== "applicant") {
        return res
            .status(403)
            .json({ error: "Only applicants can submit applications" });
        }

        const appRef = db.collection("applications").doc(applicationId);
        const appDoc = await appRef.get();

        if (!appDoc.exists) {
        return res.status(404).json({ error: "Application not found" });
        }

        const application = appDoc.data() as ApplicationResponse;

        if (application.userId !== userId) {
        return res
            .status(403)
            .json({ error: "User not authorized to submit this application" });
        }

        // may have to edit this section more to make sure all sections are filled out
        if (
        !applicationData.sectionResponses ||
        applicationData.sectionResponses.length === 0
        ) {
        return res
            .status(403)
            .json({ error: "Incomplete application: No responses provided" });
        }

        await appRef.update({
        status: ApplicationStatus.Submitted,
        dateSubmitted: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res
        .status(200)
        .json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error("Error submitting application:", error);
        return res.status(403).json({ error: "Server error" });
    }
});

export default router;
