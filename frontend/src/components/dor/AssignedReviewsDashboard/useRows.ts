import { getReviewDataForAssignment } from "@/services/reviewDataService";
import { getUserById } from "@/services/userService";
import {
  ApplicantRole,
  ApplicationReviewData,
  AppReviewAssignment,
  PermissionRole,
  ReviewerUserProfile,
} from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type AssignedAppRow = {
  index: number;
  reviewer: ReviewerUserProfile;
  reviewerName: string;
  role: ApplicantRole;
  applicantId: string;
  formId: string;
  score?: {
    value: number;
    outOf: number;
  };
  review: ApplicationReviewData | undefined;
  responseId: string;
};

export function useRows(assignments: AppReviewAssignment[], formId: string) {
  return useQuery({
    queryKey: [
      "reviewer-assignment-rows",
      assignments.map((a) => a.id).sort(),
      formId,
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments.map(async (assignment, index) => {
          const [reviewer, review] = await Promise.all([
            getUserById(assignment.reviewerId),
            getReviewDataForAssignment(assignment),
          ]);

          if (!reviewer || reviewer.role !== PermissionRole.Reviewer)
            throw new Error("Invalid reviewer!");

          const row: AssignedAppRow = {
            reviewer: reviewer,
            applicantId: assignment.applicantId,
            reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
            index: 1 + index,
            formId: assignment.formId,
            responseId: assignment.applicationResponseId,
            role: assignment.forRole,
            review: review,
            score:
              review && review.submitted
                ? {
                    value: await calculateReviewScore(review).catch((err) => {
                      console.warn(
                        `Failed to calculate score for review ${assignment.id}: ${err}`,
                      );
                      return NaN;
                    }),
                    outOf: 4, // NOTE: All scores are assumed to be out of 4
                  }
                : undefined,
          };

          return row;
        }),
      );
    },
  });
}
