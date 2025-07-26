import { signInWithEmailAndPassword, signOut, UserInfo } from "firebase/auth";
import { API_URL, auth, db } from "../config/firebase";
import axios, { AxiosError } from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  ApplicantRole,
  PermissionRole,
  ReviewerUserProfile,
  UserProfile,
} from "../types/types";
import { throwErrorToast } from "../components/toasts/ErrorToast";
import { queryClient } from "@/config/query";

export const USER_COLLECTION = "users";

export async function registerUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
): Promise<UserProfile> {
  try {
    const createdUser = (await axios.post(API_URL + "/auth/register", {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    })) as UserProfile;

    await signInWithEmailAndPassword(auth, email, password);

    return createdUser;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = `Failed to register: ${error.message} (${error.response?.data})`;
      throwErrorToast(errorMessage);
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<UserProfile> {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return await getUserById(res.user.uid);
}

export async function logoutUser() {
  await queryClient.cancelQueries()
  await queryClient.invalidateQueries()
  queryClient.clear()
  await signOut(auth);
}

export async function getUserById(id: string): Promise<UserProfile> {
  const users = collection(db, USER_COLLECTION);
  const userDoc = doc(users, id);
  const userData = (await getDoc(userDoc)).data();

  return userData as UserProfile;
}

export async function getUserByEmail(email: string): Promise<UserProfile> {
  const users = collection(db, USER_COLLECTION);
  const q = query(users, where("email", "==", email));

  const results = await getDocs(q);
  if (!results.empty) {
    return results.docs.at(0)?.data() as UserProfile;
  } else {
    throw new Error(`User with email ${email} does not exist!`);
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const users = collection(db, USER_COLLECTION);
  const results = await getDocs(users);

  return results.docs.map((d) => d.data() as UserProfile);
}

export async function updateUserRole(userId: string, role: PermissionRole) {
  const users = collection(db, USER_COLLECTION);
  const userDoc = doc(users, userId);
  await updateDoc(userDoc, {
    role: role,
  });
}

export async function updateUserRoles(userIds: string[], role: PermissionRole) {
  const batch = writeBatch(db);
  const users = collection(db, USER_COLLECTION);

  userIds.forEach((id) =>
    batch.update(doc(users, id), {
      role: role,
    }),
  );

  await batch.commit();
}

export async function deleteUsers(userIds: string[]) {
  const batch = writeBatch(db);
  const users = collection(db, USER_COLLECTION);

  userIds.forEach((id) => batch.delete(doc(users, id)));

  await batch.commit();
}

export async function setReviewerRolePreferences(
  reviewerId: string,
  prefs: ApplicantRole[],
) {
  const user = await getUserById(reviewerId);
  if (user.role != PermissionRole.Reviewer)
    throw new Error("User is not a reviewer!");

  const users = collection(db, USER_COLLECTION);
  const userDoc = doc(users, reviewerId);

  await updateDoc(userDoc, {
    applicantRolePreferences: prefs,
  } as Partial<ReviewerUserProfile>);
}

export function onAuthStateChange(
  handler: (userInfo: UserInfo | null) => void,
) {
  return auth.onAuthStateChanged((userInfo) => {
    handler(userInfo);
  });
}

export function authStateSnapshot() {
  return auth.currentUser
}
