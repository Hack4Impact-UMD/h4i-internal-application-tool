import {
  ApplicantRole,
  AppReviewAssignment,
  ReviewerAssignment,
} from "@/types/types";
import { getApplicationResponseById } from "./applicationResponsesService";
import {
  and,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { v4 as uuidv4 } from "uuid";

export const REVIEW_ASSIGNMENT_COLLECTION = "review-assignments";

export async function assignReview(
  responseId: string,
  reviewerId: string,
  role: ApplicantRole,
) {
  const response = await getApplicationResponseById(responseId);

  if (!response)
    throw new Error(
      `Attempting to assign reviewer to non-existent response with id ${responseId}`,
    );

  const reviewAssignment: ReviewerAssignment = {
    id: uuidv4(),
    assignmentType: "review",
    applicantId: response.userId,
    applicationResponseId: responseId,
    forRole: role,
    formId: response.applicationFormId,
    reviewerId: reviewerId,
  };

  const assignments = collection(db, REVIEW_ASSIGNMENT_COLLECTION);
  await setDoc(doc(assignments, reviewAssignment.id), reviewAssignment);

  return reviewAssignment;
}

export async function removeReviewAssignment(assignmentId: string) {
  const assignments = collection(db, REVIEW_ASSIGNMENT_COLLECTION);
  const assignment = doc(assignments, assignmentId);
  await deleteDoc(assignment);
}

export async function getReviewAssignments(
  formId: string,
  reviewerId: string,
): Promise<AppReviewAssignment[]> {
  const assignments = collection(db, REVIEW_ASSIGNMENT_COLLECTION);
  const q = query(
    assignments,
    and(
      where("formId", "==", formId),
      where("reviewerId", "==", reviewerId),
      where("assignmentType", "==", "review"),
    ),
  );

  const res = await getDocs(q);

  return res.docs.map((d) => d.data() as AppReviewAssignment);
}

export async function getReviewAssignmentById(
  assignmentId: string,
): Promise<ReviewerAssignment | undefined> {
  const assignments = collection(db, REVIEW_ASSIGNMENT_COLLECTION);
  const docRef = doc(assignments, assignmentId);

  return (await getDoc(docRef)).data() as ReviewerAssignment | undefined;
}

export async function getReviewAssignmentsForApplication(
  responseId: string,
): Promise<AppReviewAssignment[]> {
  const assignments = collection(db, REVIEW_ASSIGNMENT_COLLECTION);
  const q = query(
    assignments,
    where("applicationResponseId", "==", responseId),
  );

  return (await getDocs(q)).docs.map((d) => d.data() as AppReviewAssignment);
}
