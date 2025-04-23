import { useQuery } from "@tanstack/react-query";
import { ApplicationForm } from "../types/types";
import { getApplicationForm } from "../services/applicationFormsService";

export function useApplicationForm(formId?: string) {
  return useQuery<ApplicationForm>({
    queryKey: ["form", formId],
    queryFn: () => getApplicationForm(formId!),
    enabled: formId != undefined
  })
}
