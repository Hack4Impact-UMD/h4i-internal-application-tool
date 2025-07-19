import { db } from "@/config/firebase";
import {
  ApplicantRole,
  PermissionRole,
  ReviewerUserProfile,
} from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getUserById } from "./userService";

const USERS_COLLECTION = "users";

export async function getReviewerById(
  id: string,
): Promise<ReviewerUserProfile> {
  const user = await getUserById(id);
  if (user.role == PermissionRole.Reviewer) {
    return user as ReviewerUserProfile;
  } else {
    throw new Error("user is not a reviewer");
  }
}

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
