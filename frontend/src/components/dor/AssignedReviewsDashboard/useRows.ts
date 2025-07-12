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

export function useRows(
  assignments: AppReviewAssignment[],
  pageIndex: number,
  rowCount: number,
) {
  return useQuery({
    queryKey: ["reviewer-assignment-rows", pageIndex, assignments, rowCount],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments
          .slice(
            pageIndex * rowCount,
            Math.min(assignments.length, (pageIndex + 1) * rowCount),
          )
          .map(async (assignment, index) => {
            const reviewer = await getUserById(assignment.reviewerId);

            if (!reviewer || reviewer.role !== PermissionRole.Reviewer)
              throw new Error("Invalid reviewer!");

            const review = await getReviewDataForAssignment(assignment);

            const row: AssignedAppRow = {
              reviewer: reviewer,
              applicantId: assignment.applicantId,
              reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
              index: 1 + pageIndex * rowCount + index,
              formId: assignment.formId,
              responseId: assignment.applicationResponseId,
              role: assignment.forRole,
              review: review,
              score: review
                ? {
                    value: await calculateReviewScore(review),
                    outOf: 4, // NOTE: All scores are assummed to be out of 4
                  }
                : undefined,
            };

            return row;
          }),
      );
    },
  });
}
