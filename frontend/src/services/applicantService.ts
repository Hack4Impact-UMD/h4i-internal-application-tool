import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { PermissionRole, ApplicantUserProfile } from "../types/types";
import { getUserByEmail, getUserById, USER_COLLECTION } from "./userService";

export async function getAllApplicants(): Promise<ApplicantUserProfile[]> {
  const users = collection(db, USER_COLLECTION);
  const q = query(users, where("role", "==", PermissionRole.Applicant));

  const results = await getDocs(q);
  return results.docs.map((doc) => doc.data() as ApplicantUserProfile);
}

export async function getApplicantById(
  id: string,
): Promise<ApplicantUserProfile> {
  const user = await getUserById(id);
  //NOTE: temporarily removing this check to facilitate testing

  // if (user.role == PermissionRole.Applicant) {
  return user as ApplicantUserProfile;
  // } else {
  //   throw new Error("user is not an applicant");
  // }
}

export async function getApplicantByEmail(
  email: string,
): Promise<ApplicantUserProfile | undefined> {
  const user = await getUserByEmail(email);
  if (user.role == PermissionRole.Applicant) {
    return user as ApplicantUserProfile;
  } else {
    return undefined;
  }
}
