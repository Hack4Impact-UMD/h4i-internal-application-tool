import {
  ApplicationInterviewData,
  InterviewAssignment,
  ReviewerUserProfile,
} from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export type InterviewerRow = {
  index: number;
  interviewer: {
    name: string;
    id: string;
  };
  //   rolePreferences: ApplicantRole[]; TODO turn this into an interview assignment column once Qualified is merged
  assignments: number;
  pendingAssignments: number;
};

export type FlatInterviewerRow = {
  index: number;
  interviewer_name: string;
  interviewer_id: string;
  //   rolePreferences: string;
  assignments: number;
  pendingAssignments: number;
};

export function useRows(
  interviewers: ReviewerUserProfile[],
  interviewData: ApplicationInterviewData[],
  assignments: InterviewAssignment[],
) {
  return useQuery({
    queryKey: [
      "all-interviewers-rows",
      interviewers.map(x => x.id),
      interviewData.map(x => x.id),
      assignments.map(x => x.id),
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        interviewers.map(async (interviewer, index) => {
          const interviewerAssignments = assignments.filter(
            (assignment) => assignment.interviewerId == interviewer.id,
          );
          const interviewerInterviewData = interviewData.filter(
            (reviewData) => reviewData.interviewerId == interviewer.id,
          );

          const row: InterviewerRow = {
            index: 1 + index,
            interviewer: {
              id: interviewer.id,
              name: `${interviewer.firstName} ${interviewer.lastName}`,
            },
            //   rolePreferences: await getRolePreferencesForReviewer(reviewer.id),
            assignments: interviewerAssignments.length,
            pendingAssignments:
              interviewerAssignments.length -
              interviewerInterviewData.filter((data) => data.submitted).length,
          };

          return row;
        }),
      );
    },
  });
}

export function flattenRows(rows: InterviewerRow[]): FlatInterviewerRow[] {
  return rows.map(
    (row): FlatInterviewerRow => ({
      index: row.index,
      interviewer_name: row.interviewer.name,
      interviewer_id: row.interviewer.id,
      //   rolePreferences: row.rolePreferences.join(";"),
      assignments: row.assignments,
      pendingAssignments: row.pendingAssignments,
    }),
  );
}
