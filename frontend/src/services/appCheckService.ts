import { appCheck } from "@/config/firebase";
import { getToken } from "firebase/app-check";

export async function getAppCheckToken() {
  return (await getToken(appCheck)).token;
}
