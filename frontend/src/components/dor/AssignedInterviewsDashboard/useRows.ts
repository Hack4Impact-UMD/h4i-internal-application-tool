import { getInterviewDataForAssignment } from "@/services/interviewDataService";
import { getUserById } from "@/services/userService";
import {
  ApplicantRole,
  ApplicationInterviewData,
  InterviewAssignment,
  PermissionRole,
  ReviewerUserProfile,
} from "@/types/types";
import { calculateInterviewScore } from "@/utils/scores";
import { useQuery } from "@tanstack/react-query";

export type AssignedAppRow = {
  index: number;
  interviewer: ReviewerUserProfile;
  interviewerName: string;
  role: ApplicantRole;
  applicantId: string;
  formId: string;
  score?: {
    value: number;
    outOf: number;
  };
  interview: ApplicationInterviewData | undefined;
  responseId: string;
};

export function useRows(assignments: InterviewAssignment[], formId: string) {
  return useQuery({
    queryKey: [
      "interviewer-assignment-rows",
      assignments.map((a) => a.id).sort(),
      formId,
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        assignments.map(async (assignment, index) => {
          const [interviewer, interview] = await Promise.all([
            getUserById(assignment.interviewerId),
            getInterviewDataForAssignment(assignment),
          ]);

          if (!interviewer || interviewer.role !== PermissionRole.Reviewer)
            throw new Error("Invalid interviewer!");

          const row: AssignedAppRow = {
            interviewer: interviewer,
            applicantId: assignment.applicantId,
            interviewerName: `${interviewer.firstName} ${interviewer.lastName}`,
            index: 1 + index,
            formId: assignment.formId,
            responseId: assignment.applicationResponseId,
            role: assignment.forRole,
            interview: interview,
            score:
              interview && interview.submitted
                ? {
                    value: await calculateInterviewScore(interview).catch(
                      (err) => {
                        console.warn(
                          `Failed to calculate score for interview ${assignment.id}: ${err}`,
                        );
                        return NaN;
                      },
                    ),
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
