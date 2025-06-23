import { db } from "@/config/firebase";
import { RoleReviewRubric } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";

export const RUBRIC_COLLECTION = "rubrics";

export async function getRoleRubricsForForm(
  formId: string,
): Promise<RoleReviewRubric[]> {
  const rubrics = collection(db, RUBRIC_COLLECTION);
  const q = query(rubrics, where("formId", "==", formId));

  return (await getDocs(q)).docs.map((d) => d.data() as RoleReviewRubric);
}
