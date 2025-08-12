import { getApplicantById } from "@/services/applicantService";
import { getReviewAssignmentsForApplication } from "@/services/reviewAssignmentService";
import { getReviewDataForResponseRole } from "@/services/reviewDataService";
import { getApplicationStatusForResponseRole } from "@/services/statusService";
import { getUserById } from "@/services/userService";
import {
  AppReviewAssignment,
  ApplicantRole,
  ApplicationResponse,
  ApplicationReviewData,
  InternalApplicationStatus,
  ReviewerUserProfile,
} from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type ApplicationRow = {
  index: number;
  applicant: {
    name: string;
    id: string;
  };
  responseId: string;
  role: ApplicantRole;
  reviews: {
    assigned: number;
    completed: number;
    averageScore: number;
    assignments: AppReviewAssignment[];
    reviewData: ApplicationReviewData[];
  };
  reviewers: {
    assigned: ReviewerUserProfile[];
  };
  assignments: AppReviewAssignment[];
  status: InternalApplicationStatus | undefined;
};

export function useRows(
  applications: ApplicationResponse[],
  formId: string,
) {
  return useQuery({
    queryKey: ["all-apps-rows", applications, formId],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        applications
          .map(async (app, index) => {
            const user = await getApplicantById(app.userId);
            const reviews = await getReviewDataForResponseRole(
              formId,
              app.id,
              app.rolesApplied[0],
            );
            const assignments = (
              await getReviewAssignmentsForApplication(app.id)
            ).filter((a) => a.forRole === app.rolesApplied[0]);

            const completedReviews = reviews.filter((r) => r.submitted).length;
            const avgScore =
              completedReviews == 0
                ? 0
                : (
                  await Promise.all(
                    reviews
                      .filter((r) => r.submitted)
                      .map(async (r) => await calculateReviewScore(r)),
                  )
                ).reduce((acc, v) => acc + v, 0) / completedReviews;
            let status: InternalApplicationStatus | undefined;

            try {
              status = await getApplicationStatusForResponseRole(
                app.id,
                app.rolesApplied[0],
              );
            } catch (error) {
              console.log(
                `Failed to fetch application status for application ${app.id}-${app.rolesApplied[0]}: ${error}`,
              );
              status = undefined;
            }
            const row: ApplicationRow = {
              index: 1 + index,
              applicant: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
              },
              responseId: app.id,
              role: app.rolesApplied[0], //These have already been expanded into their separate roles
              reviews: {
                assigned: assignments.length,
                completed: reviews.filter((r) => r.submitted).length,
                assignments: assignments,
                averageScore: avgScore,
                reviewData: reviews,
              },
              reviewers: {
                assigned: await Promise.all(
                  assignments.map(
                    async (assignment) =>
                      (await getUserById(
                        assignment.reviewerId,
                      )) as ReviewerUserProfile,
                  ),
                ),
              },
              assignments: assignments,
              status: status,
            };

            return row;
          }),
      );
    },
  });
}
