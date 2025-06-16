import { useQuery } from "@tanstack/react-query";
import { ApplicationForm } from "../types/types";
import { getActiveForm, getAllForms, getApplicationForm } from "../services/applicationFormsService";

export function useAllApplicationForms() {
  return useQuery<ApplicationForm[]>({
    queryKey: ["form", "all"],
    queryFn: () => getAllForms(),
  })
}

export function useApplicationForm(formId?: string) {
  return useQuery<ApplicationForm>({
    queryKey: ["form", formId],
    queryFn: () => getApplicationForm(formId!),
    enabled: formId != undefined
  })
}

export function useActiveForm() {
  return useQuery<ApplicationForm>({
    queryKey: ["form", "active"],
    queryFn: getActiveForm,
  })
}
