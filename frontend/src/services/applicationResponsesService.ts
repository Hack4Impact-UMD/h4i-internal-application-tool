import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  ApplicationForm,
  ApplicationResponse,
  SectionResponse,
} from "../types/types";

export const APPLICATION_RESPONSES_COLLECTION = "application-responses";

export async function getApplicationResponses(
  userId: string
): Promise<ApplicationResponse[]> {
  const users = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const q = query(users, where("userId", "==", userId));
  const results = await getDocs(q);

  return results.docs.map((d) => d.data() as ApplicationResponse);
}

export async function getApplicationResponseByFormId(
  userId: string,
  formId: string
): Promise<ApplicationResponse | undefined> {
  const users = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const q = query(
    users,
    where("userId", "==", userId),
    where("applicationFormId", "==", formId)
  );
  const results = await getDocs(q);

  if (results.empty) {
    return undefined;
  }

  const doc = results.docs[0];
  const data = doc.data() as ApplicationResponse;

  return { ...data, applicationResponseId: doc.id };
}

export const fetchOrCreateApplicationResponse = async (
  userId: string,
  form: ApplicationForm
): Promise<string> => {
  const existingApplicationResponse = await getApplicationResponseByFormId(
    userId,
    form.id
  );

  if (existingApplicationResponse) {
    return existingApplicationResponse.applicationResponseId;
  }

  const sectionResponses: SectionResponse[] = form.sections.map((section) => ({
    sectionName: section.sectionName,
    questions: section.questions.map((question) => ({
      questionId: question.questionId,
      questionType: question.questionType,
      applicationFormId: form.id,
      response: question.questionType === "multiple-select" ? [] : "",
    })),
  }));

  const applicationResponseRef = await addDoc(
    collection(db, "application-responses"),
    {
      userId,
      applicationFormId: form.id,
      sectionResponses,
      status: "in-progress",
      dateSubmitted: null,
      rolesApplied: [],
    }
  );

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    activeApplications: arrayUnion(form.id),
  });

  return applicationResponseRef.id;
};
