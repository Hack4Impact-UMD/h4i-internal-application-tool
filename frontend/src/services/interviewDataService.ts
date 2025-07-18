import {
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
import {
    ApplicantRole,
    ApplicationInterviewData,
} from "../types/types";
import { db } from "../config/firebase";

export const INTERVIEW_DATA_COLLECTION = "interview-data";

export async function getInterviewDataForResponseRole(
    formId: string,
    responseId: string,
    role: ApplicantRole,
) {
  const interviewData = collection(db, INTERVIEW_DATA_COLLECTION);
  const q = query(
    interviewData,
    where("applicationFormId", "==", formId),
    where("applicationResponseId", "==", responseId),
    where("forRole", "==", role),
  );
  const result = await getDocs(q);
  
  return result.docs.map((doc) => doc.data() as ApplicationInterviewData);
}
  