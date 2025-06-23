import { getReviewAssignments } from "@/services/reviewAssignmentService";
import { AppReviewAssignment } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useMyReviewAssignments(formId: string) {
  const { user } = useAuth();

  return useQuery<AppReviewAssignment[]>({
    queryKey: ["assignments", formId],
    enabled: user ? true : false,
    queryFn: () => getReviewAssignments(formId, user!.id),
  });
}
