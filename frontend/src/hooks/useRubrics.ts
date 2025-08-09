import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRoleRubricsForFormRole,
  uploadRubrics as uploadRubricsService,
} from "@/services/rubricService";
import { ApplicantRole, RoleReviewRubric } from "@/types/types";

export const useUploadRubrics = () => {
  return useMutation({
    mutationFn: ({
      rubrics,
      token,
    }: {
      rubrics: RoleReviewRubric[];
      token: string;
    }) => uploadRubricsService(rubrics, token),
  });
};

export function useRubricsForFormRole(formId?: string, role?: ApplicantRole) {
  return useQuery({
    queryKey: ["rubrics", "form", "role", formId, role],
    enabled: !!formId && !!role,
    queryFn: () => getRoleRubricsForFormRole(formId!, role!),
  });
}
