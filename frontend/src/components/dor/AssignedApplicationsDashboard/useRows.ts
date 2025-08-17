import { getReviewDataForAssignment } from "@/services/reviewDataService";
import { getUserById } from "@/services/userService";
import {
  ApplicantRole,
  ApplicantUserProfile,
  ApplicationReviewData,
  AppReviewAssignment,
  PermissionRole,
} from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type AssignedAppRow = {
  index: number;
  applicant: ApplicantUserProfile;
  applicantName: string;
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
      "application-assignment-rows",
      assignments.map((x) => x.id).sort(),
      formId,
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments.map(async (assignment, index) => {
          const [applicant, review] = await Promise.all([
            getUserById(assignment.applicantId),
            getReviewDataForAssignment(assignment),
          ]);

          if (applicant.role != PermissionRole.Applicant)
            throw new Error(`User ${applicant.id} is not an applicant`);

          const row: AssignedAppRow = {
            applicant: applicant,
            applicantId: assignment.applicantId,
            applicantName: `${applicant.firstName} ${applicant.lastName}`,
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
                        `Failed to calculate score for ${applicant.id}: ${err}`,
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
