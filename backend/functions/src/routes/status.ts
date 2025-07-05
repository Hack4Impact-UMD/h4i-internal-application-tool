import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import { db } from "..";
import { CollectionReference } from "firebase-admin/firestore";
import { InternalApplicationStatus, ReviewStatus } from "../models/appStatus";
import { ApplicationForm } from "../models/appForm";
import { ApplicationResponse } from "../models/appResponse";

const router = Router();
const APPLICATION_STATUS_COLLECTION = "app-status"
const APPLICATION_FORMS_COLLECTION = "application-forms"
const APPLICATION_RESPONSE_COLLECTION = "application-responses"

async function decisionsReleased(formId: string) {
	const form = (await db.collection(APPLICATION_FORMS_COLLECTION).doc(formId).get()).data() as ApplicationForm
	return form.decisionsReleased
}


router.get("/:responseId/:role", [isAuthenticated], async (req: Request, res: Response) => {
	const response = req.params.responseId;
	const role = req.params.role;

	const responseDoc = (await db.collection(APPLICATION_RESPONSE_COLLECTION).doc(response).get()).data() as ApplicationResponse

	if (req.token?.sub !== responseDoc.userId) {
		res.status(401).send()
		return
	}

	const statusCollection = db.collection(APPLICATION_STATUS_COLLECTION) as CollectionReference<InternalApplicationStatus>
	const status = await statusCollection.where("role", "==", role).where("responseId", "==", response).get();

	const data = status.docs[0]?.data() ?? undefined
	if (!data) {
		res.status(404).send();
		return;
	}

	if (await decisionsReleased(responseDoc.applicationFormId)) {
		res.json({
			status: data.status,
			role: data.role,
			released: true
		}).send()
	} else {
		let publicStatus: ReviewStatus.UnderReview | ReviewStatus.Interview | "decided"
		if (data.status == ReviewStatus.Interview) {
			publicStatus = ReviewStatus.Interview
		} else if (data.status == ReviewStatus.Accepted || data.status == ReviewStatus.Waitlisted || data.status == ReviewStatus.Denied) {
			publicStatus = "decided"
		} else {
			publicStatus = ReviewStatus.UnderReview
		}

		res.json({
			status: publicStatus,
			role: data.role,
			released: false
		}).send()
	}
})

export default router 
