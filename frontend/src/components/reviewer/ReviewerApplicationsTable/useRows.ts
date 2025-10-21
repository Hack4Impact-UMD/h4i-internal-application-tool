import { getApplicantById } from "@/services/applicantService";
import { getReviewDataForAssignment } from "@/services/reviewDataService";
import {
  ApplicantRole,
  ApplicationReviewData,
  AppReviewAssignment,
} from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";
import { getPreviouslyAppliedCount } from "@/services/previouslyAppliedService";

export type AssignmentRow = {
  index: number;
  applicant: {
    name: string;
    id: string;
    previouslyAppliedCount: number;
  };
  responseId: string;
  role: ApplicantRole;
  review?: ApplicationReviewData;
  score: {
    value?: number;
    outOf?: number;
  };
};

export function useRows(assignments: AppReviewAssignment[], formId: string) {
  return useQuery({
    queryKey: [
      "my-assignment-rows",
      assignments.map((a) => a.id).sort(),
      formId,
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments.map(async (assignment, index) => {
          console.log(
            `Loading data for row ${index}, assignemnt ${assignment}...`,
          );

          const user = await getApplicantById(assignment.applicantId).catch(
            (e) => {
              console.error(
                "Failed to load user with ID: ",
                assignment.applicantId,
              );
              console.error(e);
              return undefined;
            },
          );
          const review = await getReviewDataForAssignment(assignment).catch(
            (e) => {
              console.error(
                "Failed to load review data for assignemnt: ",
                assignment,
              );
              console.error(e);
              return undefined;
            },
          );

          console.log("Successfully loaded row for assignemnt:", assignment);

          const numPreviouslyApplied = await getPreviouslyAppliedCount(assignment.applicantId);

          const row: AssignmentRow = {
            index: 1 + index,
            applicant: {
              id: user?.id ?? "error",
              name: `${user?.firstName ?? "Error"} ${user?.lastName ?? "Error"}`,
              previouslyAppliedCount: numPreviouslyApplied,
            },
            responseId: assignment.applicationResponseId,
            role: assignment.forRole,
            review: review,
            score: {
              value:
                review && review.submitted
                  ? await calculateReviewScore(review).catch((e) => {
                      console.error(
                        "Score calculation failed for review: ",
                        review,
                      );
                      console.error(e);
                      return NaN;
                    })
                  : undefined,
              outOf: 4, // NOTE: All scores are assummed to be out of 4
            },
          };

          return row;
        }),
      );
    },
  });
}
