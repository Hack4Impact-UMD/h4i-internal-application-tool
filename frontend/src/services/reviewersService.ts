import { db } from "@/config/firebase";
import {
  ApplicantRole,
  PermissionRole,
  ReviewCapableUser,
} from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getUserById } from "./userService";

const USERS_COLLECTION = "users";
const REVIEW_CAPABLE_ROLES = [PermissionRole.Reviewer, PermissionRole.SuperReviewer, PermissionRole.Board];

export async function getReviewerById(
  id: string,
): Promise<ReviewCapableUser> {
  const user = await getUserById(id);
  if (REVIEW_CAPABLE_ROLES.includes(user.role)) {
    return user as ReviewCapableUser;
  } else {
    throw new Error("User is not review capable");
  }
}

export async function getRolePreferencesForReviewer(
  reviewerId: string,
): Promise<ApplicantRole[]> {
  const user = await getUserById(reviewerId);
  if (REVIEW_CAPABLE_ROLES.includes(user.role)) {
    return reviewingFor(user as ReviewCapableUser);
  } else {
    throw new Error("User is not review capable")
  }
}

export async function getAllReviewers(): Promise<ReviewCapableUser[]> {
  const users = collection(db, USERS_COLLECTION);
  const q = query(users,
    where("role", "in", REVIEW_CAPABLE_ROLES),
    where("inactive", "!=", true)
  );

  return (await getDocs(q)).docs.map((d) => d.data() as ReviewCapableUser);
}

export async function getReviewersForRole(
  role: ApplicantRole,
): Promise<ReviewCapableUser[]> {
  const users = collection(db, USERS_COLLECTION);
  const q = query(
    users,
    where("role", "in", REVIEW_CAPABLE_ROLES),
    where("inactive", "!=", true),
    where("applicantRolePreferences", "array-contains", role),
  );
  return (await getDocs(q)).docs.map((d) => d.data() as ReviewCapableUser);
}

export function reviewingFor(user: ReviewCapableUser) {
  if (user.role === PermissionRole.Reviewer) {
    return user.applicantRolePreferences;
  } else if (user.role === PermissionRole.Board) {
    return user.applicantRoles;
  } else if (user.role === PermissionRole.SuperReviewer) {
    return Object.values(ApplicantRole); //NOTE: dor can review all roles
  } else {
    return []
  }
}
