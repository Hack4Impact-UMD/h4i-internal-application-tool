import { API_URL, db } from "@/config/firebase";
import { ApplicantRole, RoleReviewRubric } from "@/types/types";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const INTERVIEW_RUBRIC_COLLECTION = "interview-rubrics";

export async function getRoleInterviewRubricsForForm(
  formId: string,
): Promise<RoleReviewRubric[]> {
  const interviewRubrics = collection(db, INTERVIEW_RUBRIC_COLLECTION);
  const q = query(interviewRubrics, where("formId", "==", formId));

  return (await getDocs(q)).docs.map((d) => d.data() as RoleReviewRubric);
}

export async function getRoleInterviewRubricsForFormRole(
  formId: string,
  role: ApplicantRole,
): Promise<RoleReviewRubric[]> {
  const interviewRubrics = collection(db, INTERVIEW_RUBRIC_COLLECTION);
  const q = query(interviewRubrics, where("formId", "==", formId));

  return (await getDocs(q)).docs
    .map((d) => d.data() as RoleReviewRubric)
    .filter((r) => r.roles.length == 0 || r.roles.includes(role));
}

export async function updateRoleInterviewRubric(
  interviewRubricId: string,
  update: Partial<Omit<RoleReviewRubric, "id">>,
) {
  const rubrics = collection(db, INTERVIEW_RUBRIC_COLLECTION);
  const interviewRubricRef = doc(rubrics, interviewRubricId);

  await updateDoc(interviewRubricRef, update);
}

export async function uploadInterviewRubrics(
  interviewRubrics: RoleReviewRubric[],
  token: string,
) {
  return await axios.post(API_URL + "/application/interview-rubrics", interviewRubrics, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
