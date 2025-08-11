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

export const RUBRIC_COLLECTION = "rubrics";

export async function getRoleRubricsForForm(
  formId: string,
): Promise<RoleReviewRubric[]> {
  const rubrics = collection(db, RUBRIC_COLLECTION);
  const q = query(rubrics, where("formId", "==", formId));

  return (await getDocs(q)).docs.map((d) => d.data() as RoleReviewRubric);
}

export async function getRoleRubricsForFormRole(
  formId: string,
  role: ApplicantRole,
): Promise<RoleReviewRubric[]> {
  const rubrics = collection(db, RUBRIC_COLLECTION);
  const q = query(rubrics, where("formId", "==", formId));

  return (await getDocs(q)).docs
    .map((d) => d.data() as RoleReviewRubric)
    .filter((r) => r.roles.length == 0 || r.roles.includes(role));
}

export async function updateRoleRubric(
  rubricId: string,
  update: Partial<Omit<RoleReviewRubric, "id">>,
) {
  const rubrics = collection(db, RUBRIC_COLLECTION);
  const rubricRef = doc(rubrics, rubricId);

  await updateDoc(rubricRef, update);
}

export async function uploadRubrics(
  rubrics: RoleReviewRubric[],
  token: string,
) {
  return await axios.post(API_URL + "/application/rubrics", rubrics, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
