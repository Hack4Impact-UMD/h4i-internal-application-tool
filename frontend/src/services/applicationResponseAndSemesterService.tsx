import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { ApplicationForm, ApplicationResponse } from "../types/types";

export const APPLICATION_RESPONSES_COLLECTION = "application-responses"
export const APPLICATION_FORMS_COLLECTION = "application-forms"

export type ApplicationResponseWithSemester = ApplicationResponse & {
    semester: string;
};

export async function getApplicationResponseAndSemester(userId: string): Promise<ApplicationResponseWithSemester[]> {
  const users = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const forms = collection(db, APPLICATION_FORMS_COLLECTION);

  const q = query(users, where("userId", "==", userId));
  const results = await getDocs(q);
  const rawResponses = results.docs.map(d => d.data() as ApplicationResponse)

  const responsesWithSemester: ApplicationResponseWithSemester[] = [];

  for (const response of rawResponses) {
    const formQuery = query(forms, where("id", "==", response.applicationFormId))
    const formResults = await getDocs(formQuery)
    const matchedForms  = formResults.docs.map((d) => d.data() as ApplicationForm);

    const semester = matchedForms[0]?.semester ?? "Unknown"

    responsesWithSemester.push({
        ...response,
        semester,
    });

  }
  
  return responsesWithSemester
}