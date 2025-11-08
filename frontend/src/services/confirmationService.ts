import { API_URL } from "@/config/firebase";
import { DecisionLetterStatus } from "@/types/types";
import axios from "axios";
import { getAppCheckToken } from "./appCheckService";

export async function createDecisionConfirmation(
  decisionLetterStatus: DecisionLetterStatus,
  token: string,
) {
  const res = await axios.post(API_URL + "/decision", decisionLetterStatus, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-APPCHECK": await getAppCheckToken(),
    },
  });
  return res.data;
}