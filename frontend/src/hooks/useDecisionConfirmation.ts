import {
  getAllDecisionConfirmationsByFormId,
  getDecisionConfirmationForResponseRole,
} from "@/services/decisionConfirmationService";
import { DecisionLetterStatus } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useAllDecisionConfirmationsForForm(formId: string | undefined) {
  return useQuery<DecisionLetterStatus[]>({
    queryKey: ["decision-confirmation", "form", formId],
    enabled: !!formId,
    queryFn: () => {
      if (!formId) throw new Error("formId is required");
      return getAllDecisionConfirmationsByFormId(formId);
    },
  });
}

export function useDecisionConfirmationForResponse(
  responseId: string | undefined,
) {
  const { user } = useAuth();
  return useQuery<DecisionLetterStatus | null>({
    queryKey: ["decision-confirmation", "response", responseId],
    enabled: !!responseId && !!user,
    queryFn: () => {
      if (!responseId) throw new Error("responseId is required");
      return getDecisionConfirmationForResponseRole(user!.id, responseId);
    },
  });
}
