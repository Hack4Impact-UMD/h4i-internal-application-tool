import { useQuery } from "@tanstack/react-query"
import { ApplicantRole, ApplicationReviewData } from "../types/types"
import { getReviewDataForApplicant, getReviewDataForApplicantRole, getReviewDataForApplication } from "../services/reviewDataService"

export function useReviewDataForApplicant(applicantId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", applicantId],
    queryFn: () => {
      return getReviewDataForApplicant(applicantId)
    }
  })
}

export function useReviewDataForApplicantAndRole(applicantId: string, role: ApplicantRole) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", "role", applicantId],
    queryFn: () => {
      return getReviewDataForApplicantRole(applicantId, role)
    }
  })

}

export function useReviewDataForApplication(applicationId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicantion", applicationId],
    queryFn: () => {
      return getReviewDataForApplication(applicationId)
    }
  })
}
