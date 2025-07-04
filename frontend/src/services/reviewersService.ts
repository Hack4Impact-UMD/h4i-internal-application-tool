import { db } from "@/config/firebase";
import {
  ApplicantRole,
  PermissionRole,
  ReviewerUserProfile,
} from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";

const USERS_COLLECTION = "users";

export async function getAllReviewers(): Promise<ReviewerUserProfile[]> {
  const users = collection(db, USERS_COLLECTION);
  const q = query(users, where("role", "==", PermissionRole.Reviewer));

  return (await getDocs(q)).docs.map((d) => d.data() as ReviewerUserProfile);
}

export async function getReviewersForRole(
  role: ApplicantRole,
): Promise<ReviewerUserProfile[]> {
  const users = collection(db, USERS_COLLECTION);
  const q = query(
    users,
    where("role", "==", PermissionRole.Reviewer),
    where("applicantRolePreferences", "array-contains", role),
  );
  return (await getDocs(q)).docs.map((d) => d.data() as ReviewerUserProfile);
}
