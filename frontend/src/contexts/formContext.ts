import { createContext } from "react"
import { ApplicantRole, ApplicationForm, ApplicationResponse } from "../types/types"

export type FormProviderContext = {
  response?: ApplicationResponse,
  form?: ApplicationForm,
  updateQuestionResponse: (sectionId: string, questionId: string, newResponse: string | string[]) => void
  save: () => Promise<void>,
  selectedRoles: ApplicantRole[],
  setSelectedRoles: (roles: ApplicantRole[]) => void
}

export const FormContext = createContext<FormProviderContext>({
  updateQuestionResponse: () => { },
  save: async () => { },
  selectedRoles: [],
  setSelectedRoles: () => { }
})
