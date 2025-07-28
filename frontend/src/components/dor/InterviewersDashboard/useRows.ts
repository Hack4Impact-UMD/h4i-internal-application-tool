import { getInterviewAssignments } from "@/services/interviewAssignmentService";
import { getInterviewDataForInterviewer } from "@/services/interviewDataService";
import { ReviewerUserProfile } from "@/types/types";
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
  pageIndex: number,
  interviewers: ReviewerUserProfile[],
  rowCount: number,
  formId: string,
) {
  return useQuery({
    queryKey: ["all-interviewers-rows", pageIndex],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        interviewers
          .slice(
            pageIndex * rowCount,
            Math.min(interviewers.length, (pageIndex + 1) * rowCount),
          )
          .map(async (interviewer, index) => {
            const assignments = await getInterviewAssignments(
              formId,
              interviewer.id,
            );
            const reviewData = await getInterviewDataForInterviewer(
              formId,
              interviewer.id,
            );

            const row: InterviewerRow = {
              index: 1 + pageIndex * rowCount + index,
              interviewer: {
                id: interviewer.id,
                name: `${interviewer.firstName} ${interviewer.lastName}`,
              },
              //   rolePreferences: await getRolePreferencesForReviewer(reviewer.id),
              assignments: assignments.length,
              pendingAssignments:
                assignments.length -
                reviewData.filter((data) => data.submitted).length,
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
