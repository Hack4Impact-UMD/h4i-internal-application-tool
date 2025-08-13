import { getApplicantById } from "@/services/applicantService";
import { getInterviewDataForAssignment } from "@/services/interviewDataService";
import {
  ApplicantRole,
  ApplicantUserProfile,
  ApplicationInterviewData,
  InterviewAssignment,
} from "@/types/types";
import { calculateInterviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type InterviewAssignmentRow = {
  index: number;
  applicant: ApplicantUserProfile;
  applicantName: string;
  role: ApplicantRole;
  responseId: string;
  score?: {
    value: number;
    outOf: number;
  };
  interviewReviewData?: ApplicationInterviewData;
};

export function useRows(
  interviewAssignments: InterviewAssignment[],
  formId: string,
) {
  return useQuery({
    queryKey: ["all-interview-assignments", formId],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        interviewAssignments.map(async (assignment, index) => {
          const applicant = await getApplicantById(assignment.applicantId);
          const reviewData = await getInterviewDataForAssignment(assignment);

          const row: InterviewAssignmentRow = {
            index: 1 + index,
            applicant: applicant,
            applicantName: `${applicant.firstName} ${applicant.lastName}`,
            role: assignment.forRole,
            responseId: assignment.applicationResponseId,
            interviewReviewData: reviewData,
            score: reviewData
              ? {
                  value: await calculateInterviewScore(reviewData),
                  outOf: 4,
                }
              : undefined,
          };

          return row;
        }),
      );
    },
  });
}
