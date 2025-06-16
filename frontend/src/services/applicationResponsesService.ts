import { setDoc, Timestamp, arrayUnion, collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore";
import { API_URL, db } from "../config/firebase";
import {
  ApplicationForm,
  ApplicationResponse,
  SectionResponse,
  ValidationError,
} from "../types/types";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getApplicantsAssignedForReview } from "./applicantService";
import { getReviewAssignments } from "./reviewAssignmentService";

export const APPLICATION_RESPONSES_COLLECTION = "application-responses";

export async function uploadFile(file: File, filename: string, token: string) {
  console.log("uploading file...")
  const res = await axios.put(API_URL + "/application/upload/" + filename, file, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = res.data.path as string;

  return data
}

export async function saveApplicationResponse(response: ApplicationResponse, token: string) {
  console.log("saving...")
  const res = await axios.put(API_URL + "/application/save/" + response.id, response, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = res.data as ApplicationResponse

  return data
}

export async function getApplicationResponses(
  userId: string
): Promise<ApplicationResponse[]> {
  const responses = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const q = query(responses, where("userId", "==", userId));
  const results = await getDocs(q);

  return results.docs.map((d) => d.data() as ApplicationResponse);
}

export async function getApplicationResponseById(responseId: string): Promise<ApplicationResponse | undefined> {
  const responses = collection(db, APPLICATION_RESPONSES_COLLECTION);
  const respDoc = doc(responses, responseId)
  return (await getDoc(respDoc)).data() as (ApplicationResponse | undefined)
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

export async function getAllApplicationResponsesByFormId(formId: string): Promise<ApplicationResponse[]> {
  const responses = collection(db, APPLICATION_RESPONSES_COLLECTION)
  const q = query(
    responses,
    where("applicationFormId", "==", formId)
  )

  const results = await getDocs(q);

  return results.docs.map(d => d.data() as ApplicationResponse)
}

export async function getAssignedApplicationResponsesByFormId(formId: string, reviewerId: string): Promise<ApplicationResponse[]> {
  const assignments = (await getReviewAssignments(formId, reviewerId)).filter(a => a.assignmentType == "review");
  const responses = collection(db, APPLICATION_RESPONSES_COLLECTION)

  const q = query(responses, where("id", "in", assignments.map(a => a.applicationResponseId)))
  const res = await getDocs(q)

  return res.docs.map(d => d.data() as ApplicationResponse)
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
      response: (question.questionType === "multiple-select" || question.questionType == "role-select") ? [] : "",
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

type SuccessfulSubmitResponse = {
  status: "success",
  application: ApplicationResponse
}

type ErrorApplicationResponse = {
  status: "error",
  validationErrors: ValidationError[]
}

export type ApplicationSubmitResponse = SuccessfulSubmitResponse | ErrorApplicationResponse

export async function submitApplicationResponse(response: ApplicationResponse, token: string): Promise<ApplicationSubmitResponse> {
  const res = await axios.post(API_URL + "/application/submit", response, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = res.data as ApplicationSubmitResponse

  return data
}
