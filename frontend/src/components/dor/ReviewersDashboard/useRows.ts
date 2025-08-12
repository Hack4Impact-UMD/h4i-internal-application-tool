import {
  AppReviewAssignment,
  ApplicantRole,
  ApplicationReviewData,
  ReviewerUserProfile,
} from "@/types/types";
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

export type FlatReviewerRow = {
  index: number;
  reviewer_name: string;
  reviewer_id: string;
  rolePreferences: string;
  assignments: number;
  pendingAssignments: number;
};

export function useRows(
  reviewers: ReviewerUserProfile[],
  assignments: AppReviewAssignment[],
  reviewData: ApplicationReviewData[],
) {
  return useQuery({
    queryKey: ["all-reviewers-rows", reviewers, assignments, reviewData],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        reviewers
          .map(async (reviewer, index) => {
            const reviewerAssignments = assignments.filter(
              (assignment) => assignment.reviewerId == reviewer.id,
            );
            const reviewerReviewData = reviewData.filter(
              (reviewData) => reviewData.reviewerId == reviewer.id,
            );

            const row: ReviewerRow = {
              index: 1 + index,
              reviewer: {
                id: reviewer.id,
                name: `${reviewer.firstName} ${reviewer.lastName}`,
              },
              rolePreferences: reviewer.applicantRolePreferences,
              assignments: reviewerAssignments.length,
              pendingAssignments:
                reviewerAssignments.length -
                reviewerReviewData.filter((data) => data.submitted).length,
            };

            return row;
          }),
      );
    },
  });
}

export function flattenRows(rows: ReviewerRow[]): FlatReviewerRow[] {
  return rows.map(
    (row): FlatReviewerRow => ({
      index: row.index,
      reviewer_name: row.reviewer.name,
      reviewer_id: row.reviewer.id,
      rolePreferences: row.rolePreferences.join(";"),
      assignments: row.assignments,
      pendingAssignments: row.pendingAssignments,
    }),
  );
}
