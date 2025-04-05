import { signInWithEmailAndPassword, signOut, UserInfo } from "firebase/auth";
import { apiUrl, auth, db } from "../config/firebase";
import axios, { AxiosError } from "axios";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { UserProfile } from "../types/types";

export const USER_COLLECTION = "users";

export async function registerUser(email: string, firstName: string, lastName: string, password: string): Promise<UserProfile> {
  try {
    const createdUser = await axios.post(apiUrl + "/auth/register", {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    }) as UserProfile

    await signInWithEmailAndPassword(auth, email, password)

    return createdUser
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to register: ${error.message} (${error.response?.data})`)
    } else {
      throw error
    }
  }
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const res = await signInWithEmailAndPassword(auth, email, password)
  return await getUserById(res.user.uid)
}

export async function logoutUser() {
  await signOut(auth)
}

export async function getUserById(id: string): Promise<UserProfile> {
  const users = collection(db, USER_COLLECTION)
  const userDoc = doc(users, id)
  const userData = (await getDoc(userDoc)).data()

  return userData as UserProfile
}

export async function getUserByEmail(email: string): Promise<UserProfile> {
  const users = collection(db, USER_COLLECTION)
  const q = query(users, where("email", "==", email))

  const results = await getDocs(q)
  if (!results.empty) {
    return results.docs.at(0)?.data() as UserProfile
  } else {
    throw new Error(`User with email ${email} does not exist!`)
  }
}

export function onAuthStateChange(handler: (userInfo: UserInfo | null) => void) {
  return auth.onAuthStateChanged((userInfo) => {
    handler(userInfo)
  })
}
