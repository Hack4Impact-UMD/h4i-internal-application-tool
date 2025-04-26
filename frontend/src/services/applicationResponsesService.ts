import { setDoc, Timestamp, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  ApplicationForm,
  ApplicationResponse,
  SectionResponse,
} from "../types/types";
import { v4 as uuidv4 } from "uuid";

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
  const responses = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const q = query(
    responses,
    where("userId", "==", userId),
    where("applicationFormId", "==", formId)
  );
  const results = await getDocs(q);

  if (results.empty) {
    return undefined;
  }

  const doc = results.docs[0];
  const data = doc.data() as ApplicationResponse;

  return data;
}


export async function fetchOrCreateApplicationResponse(
  userId: string,
  form: ApplicationForm
): Promise<ApplicationResponse> {
  const existingApplicationResponse = await getApplicationResponseByFormId(
    userId,
    form.id
  );

  if (existingApplicationResponse) {
    console.log("found existing")
    console.log(existingApplicationResponse)
    return existingApplicationResponse;
  }
  console.log("creating new response object!")

  const sectionResponses: SectionResponse[] = form.sections.map((section) => ({
    sectionId: section.sectionId,
    sectionName: section.sectionName,
    questions: section.questions.map((question) => ({
      questionId: question.questionId,
      questionType: question.questionType,
      applicationFormId: form.id,
      response: question.questionType === "multiple-select" ? [] : "",
    })),
  }));

  const newResponse = {
    id: uuidv4(),
    userId,
    applicationFormId: form.id,
    sectionResponses,
    status: "in-progress",
    dateSubmitted: Timestamp.now(),
    rolesApplied: [],
  } as ApplicationResponse

  console.log("new response:")
  console.log(newResponse)

  const docRef = doc(db, APPLICATION_RESPONSES_COLLECTION, newResponse.id)

  await setDoc(
    docRef,
    newResponse
  );

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    activeApplications: arrayUnion(form.id),
  });


  return newResponse;
};
