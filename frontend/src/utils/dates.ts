import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export function displayTimestamp(timestamp: Timestamp) {
    return format(timestamp.toDate(), "M/d h:mmaaa");
}
