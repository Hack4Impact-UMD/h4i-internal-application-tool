import { getApplicantById } from "@/services/applicantService";
import { getInterviewAssignmentsForApplication } from "@/services/interviewAssignmentService";
import { getInterviewDataForResponseRole } from "@/services/interviewDataService";
import { getUserById } from "@/services/userService";
import { ApplicantRole, ApplicationInterviewData, ApplicationResponse, InterviewAssignment, PermissionRole, ReviewerUserProfile } from "@/types/types";
import { calculateInterviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type QualfiedAppRow = {
	index: number,
	name: string,
	role: ApplicantRole,
	interviewers: {
		assigned: ReviewerUserProfile[]
	},
	assignments: InterviewAssignment[],
	averageScore: number,
	responseId: string,
	interviews: ApplicationInterviewData[],
}

export function useRows(
	pageIndex: number,
	applications: ApplicationResponse[],
	rowCount: number,
	formId: string,
) {
	return useQuery<QualfiedAppRow[]>({
		queryKey: ["qualified-apps-rows", pageIndex, formId, applications.length],
		placeholderData: (prev) => prev,
		queryFn: async () => {
			return Promise.all(
				applications
					.slice(
						pageIndex * rowCount,
						Math.min(applications.length, (pageIndex + 1) * rowCount),
					)
					.map(async (app, index) => {
						const user = await getApplicantById(app.userId);
						// Get interview assignments for this application
						const assignments = (await getInterviewAssignmentsForApplication(app.id)).filter(a => a.forRole === app.rolesApplied[0]);
						// Get all assigned interviewer profiles
						const assignedInterviewers: ReviewerUserProfile[] = (
							await Promise.all(assignments.map(async (a) => await getUserById(a.interviewerId)))
						).filter((u): u is ReviewerUserProfile => u.role === PermissionRole.Reviewer);
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
								submittedInterviews.map(async (i) => await calculateInterviewScore(i))
							);
							averageScore = scores.reduce((acc, v) => acc + v, 0) / scores.length;
						}
						return {
							index: 1 + pageIndex * rowCount + index,
							name: `${user.firstName} ${user.lastName}`,
							role: app.rolesApplied[0],
							interviewers: { assigned: assignedInterviewers },
							assignments,
							averageScore,
							responseId: app.id,
							interviews,
						} as QualfiedAppRow;
					}),
			);
		},
		refetchOnWindowFocus: true,
	});
}
