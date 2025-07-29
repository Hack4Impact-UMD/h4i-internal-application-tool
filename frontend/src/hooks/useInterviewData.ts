import { getInterviewDataForForm } from "@/services/interviewDataService";
import { ApplicationInterviewData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useInterviewDataForForm(formId: string) {
  return useQuery<ApplicationInterviewData[]>({
    queryKey: ["interview-data", "form", formId],
    enabled: !!formId,
    queryFn: () => getInterviewDataForForm(formId),
  });
}
