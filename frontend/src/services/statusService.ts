import { API_URL, db } from "@/config/firebase";
import {
  ApplicantRole,
  InternalApplicationStatus,
  ReviewStatus,
} from "@/types/types";
import axios from "axios";
import {
  collection,
  CollectionReference,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const STATUS_COLLECTION = "app-status";

export async function getApplicationStatus(
  token: string,
  responseId: string,
  role: ApplicantRole,
) {
  const res = await axios.get(API_URL + `/status/${responseId}/${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data as {
    status: ReviewStatus | "decided";
    role: ApplicantRole;
    released: boolean;
  };
}

export async function getApplicationStatusForResponseRole(
  responseId: string,
  role: ApplicantRole,
) {
  const statusCollection = collection(
    db,
    STATUS_COLLECTION,
  ) as CollectionReference<InternalApplicationStatus>;
  const q = query(
    statusCollection,
    where("role", "==", role),
    where("responseId", "==", responseId),
  );

  const resp = (await getDocs(q)).docs.map((d) => d.data());

  if (resp.length > 0) return resp[0];
  else return undefined;
}

export async function updateApplicationStatus(
  statusId: string,
  update: Partial<Omit<InternalApplicationStatus, "id">>,
) {
  const statusCollection = collection(
    db,
    STATUS_COLLECTION,
  ) as CollectionReference<InternalApplicationStatus>;
  const statusDoc = doc(statusCollection, statusId);
  await updateDoc(statusDoc, update);
}

// Helper to fetch all qualified statuses for a form
export async function getQualifiedStatusesForForm(formId: string) {
  try {
    const statusCollection = collection(db, "app-status");
    const q = query(
      statusCollection,
      where("formId", "==", formId),
      where("isQualified", "==", true),
    );
    const docsSnap = await getDocs(q);
    return docsSnap.docs.map((d) => d.data() as InternalApplicationStatus);
  } catch (error) {
    console.error("Failed to fetch qualified statuses:", error);
    throw error;
  }
}
