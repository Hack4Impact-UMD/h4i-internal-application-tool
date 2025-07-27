import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  ApplicantRole,
  ApplicationInterviewData,
  InterviewAssignment,
} from "../types/types";
import { db } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

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

export async function getInterviewDataForAssignment(
  assignment: InterviewAssignment,
) {
  const reviewData = collection(db, INTERVIEW_DATA_COLLECTION);
  const q = query(
    reviewData,
    where("applicantId", "==", assignment.applicantId),
    where("forRole", "==", assignment.forRole),
    where("applicationFormId", "==", assignment.formId),
    where("interviewerId", "==", assignment.interviewerId),
  );
  const result = await getDocs(q);

  if (result.docs.length < 1) return undefined;

  return result.docs[0].data() as ApplicationInterviewData;
}

export async function createInterviewData(
  review: Omit<ApplicationInterviewData, "id">,
) {
  const reviewData = collection(db, INTERVIEW_DATA_COLLECTION);
  const id = uuidv4();
  const reviewDoc: ApplicationInterviewData = {
    id: id,
    ...review,
  };
  const docRef = doc(reviewData, id);

  await setDoc(docRef, reviewDoc);

  return reviewDoc;
}
