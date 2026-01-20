import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export function displayTimestamp(timestamp?: Timestamp) {
  if (!timestamp) return "N/A";
  return format(timestamp.toDate(), "M/d h:mmaaa");
}
