import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { apiUrl, auth, db } from "../config/firebase";
import axios from "axios";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export type UserRole = "applicant" | "reviewer" | "super-reviewer"

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export async function registerUser(email: string, firstName: string, lastName: string, password: string): Promise<User> {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  return await axios.post(apiUrl + "/register", {
    id: user.user.uid,
    email: email,
    firstName: firstName,
    lastName: lastName
  }) as User
}

export async function loginUser(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function getUserById(id: string): Promise<User> {
  const users = collection(db, "users")
  const userDoc = doc(users, id)
  const userData = (await getDoc(userDoc)).data()

  return {
    id: userDoc.id,
    ...userData
  } as User
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = collection(db, "users")
  const q = query(users, where("email", "==", email))

  const results = await getDocs(q)
  if (!results.empty) {
    return {
      id: results.docs.at(0)?.id,
      ...results.docs.at(0)?.data()
    } as User
  } else {
    return undefined
  }
}

