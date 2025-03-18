import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserInfo } from "firebase/auth";
import { apiUrl, auth, db } from "../config/firebase";
import axios from "axios";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export enum PermissionRole {
  SuperReviewer = "super-reviewer",
  Reviewer = "reviewer",
  Applicant = "applicant"
}

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: PermissionRole;
}

export async function registerUser(email: string, firstName: string, lastName: string, password: string): Promise<UserProfile> {
  const createdUser = await axios.post(apiUrl + "/auth/register", {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName
  }) as UserProfile

  await signInWithEmailAndPassword(auth, email, password)

  return createdUser
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const res = await signInWithEmailAndPassword(auth, email, password)
  return await getUserById(res.user.uid)
}

export async function logoutUser() {
  await signOut(auth)
}

export async function getUserById(id: string): Promise<UserProfile> {
  const users = collection(db, "users")
  const userDoc = doc(users, id)
  const userData = (await getDoc(userDoc)).data()

  console.log(userData)

  return {
    id: userDoc.id,
    ...userData
  } as UserProfile
}

export async function getUserByEmail(email: string): Promise<UserProfile | undefined> {
  const users = collection(db, "users")
  const q = query(users, where("email", "==", email))

  const results = await getDocs(q)
  if (!results.empty) {
    return {
      id: results.docs.at(0)?.id,
      ...results.docs.at(0)?.data()
    } as UserProfile
  } else {
    return undefined
  }
}

export function onAuthStateChange(handler: (userInfo: UserInfo | null) => void) {
  return auth.onAuthStateChanged((userInfo) => {
    handler(userInfo)
  })
}
