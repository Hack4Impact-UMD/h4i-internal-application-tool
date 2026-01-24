import { API_URL, db } from "@/config/firebase";
import { DecisionLetterStatus } from "@/types/types";
import axios from "axios";
import { getAppCheckToken } from "./appCheckService";
import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const CONFIRMATION_COLLECTION = "decision-status";

export async function createDecisionConfirmation(
  decisionLetterStatus: DecisionLetterStatus,
  token: string,
) {
  const res = await axios.post(
    API_URL + "/status/decision",
    decisionLetterStatus,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-APPCHECK": await getAppCheckToken(),
      },
    },
  );
  return res.data;
}

export async function getDecisionConfirmationForResponseRole(
  userId: string,
  responseId: string,
) {
  const confirmationCollection = collection(
    db,
    CONFIRMATION_COLLECTION,
  ) as CollectionReference<DecisionLetterStatus>;
  const q = query(
    confirmationCollection,
    where("userId", "==", userId),
    where("responseId", "==", responseId),
  );

  const resp = (await getDocs(q)).docs.map((d) => d.data());

  if (resp.length > 0) return resp[0];
  else return null;
}

export async function getAllDecisionConfirmationsByFormId(
  formId: string,
): Promise<DecisionLetterStatus[]> {
  const responses = collection(db, CONFIRMATION_COLLECTION);
  const q = query(responses, where("formId", "==", formId));

  const results = await getDocs(q);

  return results.docs.map((d) => d.data() as DecisionLetterStatus);
}
