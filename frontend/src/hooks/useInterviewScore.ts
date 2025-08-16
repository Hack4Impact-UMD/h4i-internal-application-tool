import { ApplicationInterviewData } from "@/types/types";
import { calculateInterviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export function useInterviewScore(interview?: ApplicationInterviewData) {
  return useQuery({
    queryKey: ["score", "interview", interview?.id ?? ""],
    enabled: !!interview,
    queryFn: () => calculateInterviewScore(interview!),
  });
}
