import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRoleInterviewRubricsForFormRole,
  uploadInterviewRubrics as uploadInterviewRubricsService,
} from "@/services/interviewRubricService";
import { ApplicantRole, RoleReviewRubric } from "@/types/types";

export const useUploadInterviewRubrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      interviewRubrics,
      token,
    }: {
      interviewRubrics: RoleReviewRubric[];
      token: string;
    }) => uploadInterviewRubricsService(interviewRubrics, token),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-rubrics"] });
    },
  });
};

export function useInterviewRubricsForFormRole(
  formId?: string,
  role?: ApplicantRole,
) {
  return useQuery({
    queryKey: ["interview-rubrics", "form", "role", formId, role],
    enabled: !!formId && !!role,
    queryFn: () => getRoleInterviewRubricsForFormRole(formId!, role!),
  });
}
