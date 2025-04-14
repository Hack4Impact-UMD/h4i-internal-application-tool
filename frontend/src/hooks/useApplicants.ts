import { useQuery } from "@tanstack/react-query";
import { getAllApplicants, getApplicantsAssignedForReview } from "../services/applicantService.ts";
import { ApplicantUserProfile, PermissionRole, ReviewerUserProfile } from "../types/types";
import { useAuth } from "./useAuth";

export function useApplicants() {
  return useQuery<ApplicantUserProfile[]>({
    queryKey: ["applicants"],
    queryFn: getAllApplicants
  })
}

export function useAssignedReviewApplicants() {
  const { user, isLoading, isAuthed } = useAuth()
  return useQuery<ApplicantUserProfile[]>({
    queryKey: ["assigned", "applicants", "review", user?.id],
    enabled: !isLoading && isAuthed && user?.role == PermissionRole.Reviewer,
    queryFn: () => getApplicantsAssignedForReview(user as ReviewerUserProfile)
  })
}

