import { getApplicantById } from "@/services/applicantService";
import { getApplicationForm } from "@/services/applicationFormsService";
import { getPreviouslyAppliedCount } from "@/services/previouslyAppliedService";
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
  ReviewCapableUser,
} from "@/types/types";
import { calculateReviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";

export type ApplicationRow = {
  index: number;
  dateSubmitted: Timestamp;
  applicant: {
    name: string;
    id: string;
    email: string;
    previouslyAppliedCount: number;
    internal: boolean;
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
    assigned: ReviewCapableUser[];
  };
  assignments: AppReviewAssignment[];
  status: InternalApplicationStatus | undefined;
};

export function useRows(applications: ApplicationResponse[], formId: string) {
  return useQuery({
    queryKey: ["all-apps-rows", applications.map((a) => a.id).sort(), formId],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const form = await getApplicationForm(formId);
      return Promise.all(
        applications.map(async (app, index) => {
          const role = app.rolesApplied[0];

          const [user, reviews, allAssignments] = await Promise.all([
            getApplicantById(app.userId),
            getReviewDataForResponseRole(formId, app.id, role),
            getReviewAssignmentsForApplication(app.id),
          ]);
          const assignments = allAssignments.filter((a) => a.forRole === role);

          const completedReviews = reviews.filter((r) => r.submitted).length;
          const avgScore =
            completedReviews == 0
              ? 0
              :
              reviews
                .filter((r) => r.submitted)
                .map(
                  (r) =>
                    calculateReviewScore(r, form),
                ).reduce((acc, v) => acc + v, 0) / completedReviews;
          let status: InternalApplicationStatus | undefined;

          try {
            status = await getApplicationStatusForResponseRole(app.id, role);
          } catch (error) {
            console.log(
              `Failed to fetch application status for application ${app.id}-${role}: ${error}`,
            );
            status = undefined;
          }

          const numPreviouslyApplied = await getPreviouslyAppliedCount(
            app.userId,
          );

          const row: ApplicationRow = {
            index: 1 + index,
            dateSubmitted: app.dateSubmitted,
            applicant: {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              previouslyAppliedCount: numPreviouslyApplied,
              internal: user.isInternal ?? false
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
                    )) as ReviewCapableUser,
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
