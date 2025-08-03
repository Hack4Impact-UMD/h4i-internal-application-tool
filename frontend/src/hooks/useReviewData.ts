import { useQuery } from "@tanstack/react-query";
import { ApplicantRole, ApplicationReviewData } from "../types/types";
import {
  getReviewDataById,
  getReviewDataForApplicant,
  getReviewDataForApplicantRole,
  getReviewDataForApplication,
  getReviewDataForForm,
  getReviewDataForReviewer,
} from "../services/reviewDataService";
import { useAuth } from "./useAuth";

export function useReviewData(reviewDataId: string) {
  return useQuery<ApplicationReviewData>({
    queryKey: ["review-data", "id", reviewDataId],
    enabled: !!reviewDataId,
    queryFn: () => getReviewDataById(reviewDataId),
  });
}

export function useReviewDataForApplicant(formId: string, applicantId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", formId, applicantId],
    queryFn: () => {
      return getReviewDataForApplicant(formId, applicantId);
    },
  });
}

export function useReviewDataForReviewer(formId: string, reviewerId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "reviewer", formId, reviewerId],
    queryFn: () => {
      return getReviewDataForReviewer(formId, reviewerId);
    },
  });
}

export function useReviewDataForApplicantAndRole(
  formId: string,
  applicantId: string,
  role: ApplicantRole,
) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicant", "role", formId, applicantId],
    queryFn: () => {
      return getReviewDataForApplicantRole(formId, applicantId, role);
    },
  });
}

export function useReviewDataForApplication(applicationResponseId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "applicantion-response", applicationResponseId],
    queryFn: () => {
      return getReviewDataForApplication(applicationResponseId);
    },
  });
}

export function useMyReviews(formId: string) {
  const { user } = useAuth();
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "me", formId, user?.id],
    enabled: !!user,
    queryFn: () => getReviewDataForReviewer(formId, user!.id),
  });
}

export function useReviewDataForForm(formId: string) {
  return useQuery<ApplicationReviewData[]>({
    queryKey: ["review-data", "form", formId],
    enabled: !!formId,
    queryFn: () => getReviewDataForForm(formId),
  });
}
