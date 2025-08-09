import { ApplicationReviewData } from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export function useReviewScore(review: ApplicationReviewData) {
	return useQuery({
		queryKey: ["score", "review", review],
		enabled: !!review,
		queryFn: () => calculateReviewScore(review)
	})
}
