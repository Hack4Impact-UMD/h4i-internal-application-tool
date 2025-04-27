import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { fetchOrCreateApplicationResponse, getApplicationResponses } from "../services/applicationResponsesService";
import { ApplicationForm, ApplicationResponse } from "../types/types";
import { getApplicationForm } from "../services/applicationFormsService";

export function useApplicationResponses() {
  const { user, isAuthed, isLoading } = useAuth()

  return useQuery<ApplicationResponse[]>({
    queryKey: ["responses", user?.id],
    enabled: !isLoading && isAuthed,
    queryFn: () => {
      return getApplicationResponses(user!.id)
    },
    initialData: []
  })
}

export function useApplicationResponseAndForm(formId?: string) {
  const { user, isAuthed, isLoading } = useAuth()

  return useQuery<{ form: ApplicationForm, response: ApplicationResponse }>({
    queryKey: ["responses", user?.id, formId],
    gcTime: 0,
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
