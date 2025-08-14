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

export function useRows(applications: ApplicationResponse[], formId: string) {
  return useQuery({
    queryKey: ["all-apps-rows", applications.map(a => a.id), formId],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        applications.map(async (app, index) => {
          const role = app.rolesApplied[0];

          const [user, reviews, allAssignments] = await Promise.all([
            getApplicantById(app.userId),
            getReviewDataForResponseRole(
              formId,
              app.id,
              role,
            ),
            getReviewAssignmentsForApplication(app.id)
          ])
          const assignments = allAssignments.filter((a) => a.forRole === role);

          const completedReviews = reviews.filter((r) => r.submitted).length;
          const avgScore =
            completedReviews == 0
              ? 0
              : (
                await Promise.all(
                  reviews
                    .filter((r) => r.submitted)
                    .map(async (r) => await calculateReviewScore(r).catch(() => NaN)),
                )
              ).reduce((acc, v) => acc + v, 0) / completedReviews;
          let status: InternalApplicationStatus | undefined;

          try {
            status = await getApplicationStatusForResponseRole(
              app.id,
              role
            );
          } catch (error) {
            console.log(
              `Failed to fetch application status for application ${app.id}-${role}: ${error}`,
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
            role: role, //These have already been expanded into their separate roles
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
