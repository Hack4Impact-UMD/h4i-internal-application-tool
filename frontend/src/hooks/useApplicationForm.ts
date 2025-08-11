import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationForm } from "../types/types";
import {
  getActiveForm,
  getAllForms,
  getApplicationForm,
  createApplicationForm,
  getApplicationFormForResponseId,
} from "../services/applicationFormsService";

export function useAllApplicationForms() {
  return useQuery<ApplicationForm[]>({
    queryKey: ["form", "all"],
    queryFn: () => getAllForms(),
  });
}

export function useApplicationForm(formId?: string) {
  return useQuery<ApplicationForm>({
    queryKey: ["form", formId],
    queryFn: () => getApplicationForm(formId!),
    enabled: formId != undefined,
  });
}

export function useActiveForm() {
  return useQuery<ApplicationForm>({
    queryKey: ["form", "active"],
    queryFn: getActiveForm,
  });
}

export const useUploadApplicationForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ form, token }: { form: ApplicationForm; token: string }) =>
      createApplicationForm(form, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form", "all"] });
    },
  });
};

export function useApplicationFormForResponseId(responseId?: string) {
  return useQuery<ApplicationForm>({
    queryKey: ["form", "responseId", responseId],
    queryFn: () => getApplicationFormForResponseId(responseId!),
    enabled: responseId != undefined,
  });
}
