import { useQuery } from "@tanstack/react-query"
import { ApplicantRole, ApplicationReviewData } from "../types/types"
import { getReviewDataForApplicant, getReviewDataForApplicantRole, getReviewDataForApplication, getReviewDataForReviewer } from "../services/reviewDataService"
import { useAuth } from "./useAuth"

export function useReviewDataForApplicant(formId: string, applicantId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", formId, applicantId],
    queryFn: () => {
      return getReviewDataForApplicant(formId, applicantId)
    }
  })
}

export function useReviewDataForApplicantAndRole(formId: string, applicantId: string, role: ApplicantRole) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", "role", formId, applicantId],
    queryFn: () => {
      return getReviewDataForApplicantRole(formId, applicantId, role)
    }
  })

}

export function useReviewDataForApplication(applicationResponseId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicantion-response", applicationResponseId],
    queryFn: () => {
      return getReviewDataForApplication(applicationResponseId)
    }
  })
}

export function useMyReviews(formId: string) {
  const { user } = useAuth()
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "me", formId, user?.id],
    enabled: !!user,
    queryFn: () => getReviewDataForReviewer(formId, user!.id)
  })
}
