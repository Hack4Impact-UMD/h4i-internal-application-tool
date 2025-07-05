import { API_URL } from "@/config/firebase";
import { ApplicantRole, ReviewStatus } from "@/types/types";
import axios from "axios";

export default async function getApplicationStatus(token: string, responseId: string, role: ApplicantRole) {
	const res = await axios.get(API_URL + `/status/${responseId}/${role}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	return res.data as {
		status: ReviewStatus | "decided",
		role: ApplicantRole,
		released: boolean
	}
}
