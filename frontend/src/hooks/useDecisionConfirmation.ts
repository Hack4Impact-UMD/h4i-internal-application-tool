import { getAllDecisionConfirmationsByFormId } from "@/services/decisionConfirmationService";
import { DecisionLetterStatus } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

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
