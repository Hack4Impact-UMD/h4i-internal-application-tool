import { getAllReviewers, getReviewersForRole } from "@/services/reviewersService";
import { ApplicantRole } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useAllReviewers() {
  return useQuery({
    queryKey: ["reviewers"],
    queryFn: () => getAllReviewers(),
  })
}

export function useReviewersForRole(role: ApplicantRole) {
  return useQuery({
    queryKey: ["reviewers", "role", role],
    queryFn: () => getReviewersForRole(role),
  });
}
