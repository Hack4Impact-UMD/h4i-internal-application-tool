import { getApplicantById } from "@/services/applicantService";
import { getReviewDataForAssignemnt } from "@/services/reviewDataService";
import {
  ApplicantRole,
  ApplicationReviewData,
  AppReviewAssignment,
} from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type AssignmentRow = {
  index: number;
  applicant: {
    name: string;
    id: string;
  };
  responseId: string;
  role: ApplicantRole;
  review?: ApplicationReviewData;
  score: {
    value?: number;
    outOf?: number;
  };
};

export function useRows(
  assignments: AppReviewAssignment[],
  pageIndex: number,
  rowCount: number,
) {
  return useQuery({
    queryKey: ["my-assignment-rows", pageIndex, assignments, rowCount],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments
          .slice(
            pageIndex * rowCount,
            Math.min(assignments.length, (pageIndex + 1) * rowCount),
          )
          .map(async (assignment, index) => {
            const user = await getApplicantById(assignment.applicantId);
            const review = await getReviewDataForAssignemnt(assignment);

            const row: AssignmentRow = {
              index: 1 + pageIndex * rowCount + index,
              applicant: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
              },
              responseId: assignment.applicationResponseId,
              role: assignment.forRole,
              review: review,
              score: {
                value: review ? await calculateReviewScore(review) : undefined,
                outOf: 4, // NOTE: All scores are assummed to be out of 4
              },
            };

            return row;
          }),
      );
    },
  });
}
