import { getApplicantById } from "@/services/applicantService";
import { getApplicationForm } from "@/services/applicationFormsService";
import { getInterviewAssignmentsForApplication } from "@/services/interviewAssignmentService";
import { getInterviewDataForResponseRole } from "@/services/interviewDataService";
import { reviewCapable } from "@/services/reviewersService";
import { getApplicationStatusForResponseRole } from "@/services/statusService";
import { getUserById } from "@/services/userService";
import {
  ApplicantRole,
  ApplicationInterviewData,
  ApplicationResponse,
  InterviewAssignment,
  InternalApplicationStatus,
  ReviewCapableUser,
} from "@/types/types";
import { calculateInterviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";

export type QualifiedAppRow = {
  index: number;
  dateSubmitted: Timestamp;
  name: string;
  email: string;
  role: ApplicantRole;
  interviewers: {
    assigned: ReviewCapableUser[];
  };
  assignments: InterviewAssignment[];
  averageScore: number | null;
  responseId: string;
  interviews: ApplicationInterviewData[];
  status?: InternalApplicationStatus;
  internal: boolean
};

export function useRows(applications: ApplicationResponse[], formId: string) {
  return useQuery<QualifiedAppRow[]>({
    queryKey: [
      "qualified-apps-rows",
      formId,
      applications.map((x) => x.id).sort(),
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const form = await getApplicationForm(formId);
      return Promise.all(
        applications.map(async (app, index) => {
          const user = await getApplicantById(app.userId);
          // Get interview assignments for this application
          const assignments = (
            await getInterviewAssignmentsForApplication(app.id)
          ).filter((a) => a.forRole === app.rolesApplied[0]);
          // Get all assigned interviewer profiles
          const assignedInterviewers: ReviewCapableUser[] = (
            await Promise.all(
              assignments.map((a) => getUserById(a.interviewerId)),
            )
          ).filter((u) => reviewCapable(u));
          // Get interview data for this application/role
          const interviews = await getInterviewDataForResponseRole(
            formId,
            app.id,
            app.rolesApplied[0],
          );
          const submittedInterviews = interviews.filter((i) => i.submitted);
          // Calculate average score
          let averageScore: number | null = null;
          if (submittedInterviews.length > 0) {
            const scores = await Promise.all(
              submittedInterviews.map(
                (i) => calculateInterviewScore(i, form),
              ),
            );
            averageScore =
              scores.reduce((acc, v) => acc + v, 0) / scores.length;
          }
          const status = await getApplicationStatusForResponseRole(
            app.id,
            app.rolesApplied[0],
          );
          return {
            index: 1 + index,
            dateSubmitted: app.dateSubmitted,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: app.rolesApplied[0],
            interviewers: { assigned: assignedInterviewers },
            assignments,
            averageScore,
            responseId: app.id,
            interviews,
            status,
            internal: user.isInternal ?? false
          };
        }),
      );
    },
    refetchOnWindowFocus: true,
  });
}
