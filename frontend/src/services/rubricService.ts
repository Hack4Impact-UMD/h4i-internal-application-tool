import { db } from "@/config/firebase";
import { ApplicantRole, RoleReviewRubric } from "@/types/types";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

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
  const q = query(
    rubrics, 
    where("formId", "==", formId),
    where("role", "==", role),
  );

  return (await getDocs(q)).docs.map((d) => d.data() as RoleReviewRubric);
}

export async function updateRoleRubric(
  rubricId: string,
  update: Partial<Omit<RoleReviewRubric, "id">>,
) {
  const rubrics = collection(db, RUBRIC_COLLECTION);
  const rubricRef = doc(rubrics, rubricId);
  
  await updateDoc(rubricRef, update);
}
