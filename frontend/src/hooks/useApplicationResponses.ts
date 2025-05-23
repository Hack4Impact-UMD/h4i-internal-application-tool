import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { fetchOrCreateApplicationResponse, getAllApplicationResponsesByFormId, getApplicationResponses } from "../services/applicationResponsesService";
import { ApplicationForm, ApplicationResponse } from "../types/types";
import { getApplicationForm } from "../services/applicationFormsService";

//gets the current user's application responses
export function useMyApplicationResponses() {
  const { user, isAuthed, isLoading } = useAuth()

  return useQuery<ApplicationResponse[]>({
    queryKey: ["responses", "user", user?.id],
    enabled: !isLoading && isAuthed,
    queryFn: () => {
      return getApplicationResponses(user!.id)
    },
    initialData: []
  })
}

//gets the current user's application response for the form and the form itself
export function useMyApplicationResponseAndForm(formId?: string) {
  const { user, isAuthed, isLoading } = useAuth()

  return useQuery<{ form: ApplicationForm, response: ApplicationResponse }>({
    queryKey: ["responses", "user", user?.id, formId],
    enabled: !isLoading && isAuthed && formId != undefined,
    queryFn: async () => {
      const form = await getApplicationForm(formId!);
      console.log(`form found: ${form.semester}`)
      const response = await fetchOrCreateApplicationResponse(user!.id, form)
      console.log(`got response: ${response.id}`)
      return {
        form: form,
        response: response
      }
    },
  })
}

//gets all application responses for a given form, includes in-progress submissions
export function useAllApplicationResponsesForForm(formId: string) {
  return useQuery<ApplicationResponse[]>({
    queryKey: ["responses", "form", formId],
    queryFn: () => getAllApplicationResponsesByFormId(formId)
  })
}

export function useAssignedApplicationResponsesForForm(formId: string) {
}
