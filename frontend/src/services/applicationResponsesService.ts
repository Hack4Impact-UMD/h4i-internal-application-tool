import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { ApplicationResponse } from "../types/types";

export const APPLICATION_RESPONSES_COLLECTION = "application-responses"

export async function getApplicationResponses(userId: string): Promise<ApplicationResponse[]> {
  const users = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const q = query(users, where("userId", "==", userId));
  const results = await getDocs(q);

  return results.docs.map(d => d.data() as ApplicationResponse)
}

// export async function getApplicationResponseById(responseId: string): Promise<ApplicationResponse> {
//
// }
