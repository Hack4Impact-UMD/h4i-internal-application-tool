import { getReviewAssignments } from "@/services/reviewAssignmentService";
import { ReviewerAssignment } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useMyReviewAssignments(formId: string) {
	const { user } = useAuth()

	return useQuery<ReviewerAssignment[]>({
		queryKey: ['assignments', formId],
		enabled: user ? true : false,
		queryFn: () => getReviewAssignments(formId, user!.id)
	})
}
