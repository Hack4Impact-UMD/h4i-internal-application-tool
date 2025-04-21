import { and, collection, getDocs, query, where } from "firebase/firestore";
import { ApplicantRole, ApplicationReviewData } from "../types/types";
import { db } from "../config/firebase";

export const REVIEW_DATA_COLLECTION = "review-data"

export async function getReviewDataForApplication(applicationResponseId: string) {
  const reviewData = collection(db, REVIEW_DATA_COLLECTION)
  const q = query(reviewData, where("applicationResponseId", "==", applicationResponseId))
  const result = await getDocs(q)

  return result.docs.map(doc => doc.data() as ApplicationReviewData)
}

export async function getReviewDataForApplicant(applicantId: string) {
  const reviewData = collection(db, REVIEW_DATA_COLLECTION)
  const q = query(reviewData, where("applicantId", "==", applicantId))
  const result = await getDocs(q)

  return result.docs.map(doc => doc.data() as ApplicationReviewData)
}

export async function getReviewDataForApplicantRole(applicantId: string, role: ApplicantRole) {
  const reviewData = collection(db, REVIEW_DATA_COLLECTION)
  const q = query(reviewData, and(where("applicantId", "==", applicantId), where("forRole", "==", role.toString())))
  const result = await getDocs(q)

  return result.docs.map(doc => doc.data() as ApplicationReviewData)
}


export async function updateReviewData(applicationId: string) {
  //TODO: Implement! 
}
