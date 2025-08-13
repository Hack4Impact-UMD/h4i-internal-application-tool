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
    queryKey: ["application-assignment-rows", assignments, formId],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments.map(async (assignment, index) => {
          const applicant = await getUserById(assignment.applicantId);

          if (!applicant || applicant.role !== PermissionRole.Applicant)
            throw new Error("Invalid applicant!");

          const review = await getReviewDataForAssignment(assignment);

          const row: AssignedAppRow = {
            applicant: applicant,
            applicantId: assignment.applicantId,
            applicantName: `${applicant.firstName} ${applicant.lastName}`,
            index: 1 + index,
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
