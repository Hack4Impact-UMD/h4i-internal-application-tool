import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { PermissionRole, ApplicantUserProfile, ReviewerUserProfile } from "../types/types";
import { getUserByEmail, getUserById, USER_COLLECTION } from "./userService";

export async function getAllApplicants(): Promise<ApplicantUserProfile[]> {
  const users = collection(db, USER_COLLECTION);
  const q = query(users, where("role", "==", PermissionRole.Applicant));

  const results = await getDocs(q);
  return results.docs.map(doc => doc.data() as ApplicantUserProfile);
}

export async function getApplicantsAssignedForReview(reviewer: ReviewerUserProfile): Promise<ApplicantUserProfile[]> {
  const assigned = reviewer.reviewAssignments.applicationReviewAssignments.map(a => a.applicantId) ?? [];
  const users = collection(db, USER_COLLECTION);
  const q = query(users, where("id", "in", assigned));
  const results = await getDocs(q);

  return results.docs.map(doc => doc.data() as ApplicantUserProfile)
}

export async function getApplicantById(id: string): Promise<ApplicantUserProfile | undefined> {
  const user = await getUserById(id);
  if (user.role == PermissionRole.Applicant) {
    return user as ApplicantUserProfile;
  } else {
    return undefined
  }
}

export async function getApplicantByEmail(email: string): Promise<ApplicantUserProfile | undefined> {
  const user = await getUserByEmail(email);
  if (user.role == PermissionRole.Applicant) {
    return user as ApplicantUserProfile;
  } else {
    return undefined
  }
}
