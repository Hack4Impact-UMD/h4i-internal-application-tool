import { collection, doc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { ApplicationForm } from "../types/types"

export const APPLICATION_FORMS_COLLECTION = "application-forms"

export async function getApplicationForm(formId: string): Promise<ApplicationForm> {
  const forms = collection(db, APPLICATION_FORMS_COLLECTION)
  const form = await getDoc(doc(forms, formId))

  return form.data() as ApplicationForm
}
