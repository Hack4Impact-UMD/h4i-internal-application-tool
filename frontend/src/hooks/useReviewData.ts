import { useQuery } from "@tanstack/react-query"
import { ApplicationReviewData } from "../types/types"
import { getReviewDataForApplicant, getReviewDataForApplication } from "../services/reviewDataService"

export function useReviewDataForApplicant(applicantId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", applicantId],
    queryFn: () => {
      return getReviewDataForApplicant(applicantId)
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
