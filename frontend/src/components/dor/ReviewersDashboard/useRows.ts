import { getReviewAssignments } from "@/services/reviewAssignmentService";
import { getReviewDataForReviewer } from "@/services/reviewDataService";
import { getRolePreferencesForReviewer } from "@/services/reviewersService";
import { ApplicantRole, ReviewerUserProfile } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export type ReviewerRow = {
  index: number;
  reviewer: {
    name: string;
    id: string;
  };
  rolePreferences: ApplicantRole[];
  assignments: number;
  pendingAssignments: number;
};

export function useRows(
  pageIndex: number,
  reviewers: ReviewerUserProfile[],
  rowCount: number,
  formId: string,
) {
  return useQuery({
    queryKey: ["all-reviewers-rows", pageIndex],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        reviewers
          .slice(
            pageIndex * rowCount,
            Math.min(reviewers.length, (pageIndex + 1) * rowCount),
          )
          .map(async (reviewer, index) => {
            const assignments = await getReviewAssignments(formId, reviewer.id);
            const reviewData = await getReviewDataForReviewer(
              formId,
              reviewer.id,
            );

            const row: ReviewerRow = {
              index: 1 + pageIndex * rowCount + index,
              reviewer: {
                id: reviewer.id,
                name: `${reviewer.firstName} ${reviewer.lastName}`,
              },
              rolePreferences: await getRolePreferencesForReviewer(reviewer.id),
              assignments: assignments.length,
              pendingAssignments:
                assignments.length -
                reviewData.filter((data) => data.submitted).length,
            };

            return row;
          }),
      );
    },
  });
}
