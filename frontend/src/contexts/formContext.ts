import { createContext } from "react"
import { ApplicationForm, ApplicationResponse } from "../types/types"

export type FormProviderContext = {
  response?: ApplicationResponse,
  form?: ApplicationForm,
  updateQuestionResponse: (sectionId: string, questionId: string, newResponse: string | string[]) => void
  save: () => Promise<void>
}

export const FormContext = createContext<FormProviderContext>({
  updateQuestionResponse: () => { },
  save: async () => { }
})
