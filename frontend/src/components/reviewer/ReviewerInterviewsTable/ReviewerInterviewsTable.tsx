import {
  ApplicantRole,
  ApplicationInterviewData,
  InterviewAssignment,
} from "@/types/types";
import {
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import ApplicantRolePill from "@/components/role-pill/RolePill";
import { InterviewAssignmentRow, useRows } from "./useRows";
import { createInterviewData } from "@/services/interviewDataService";
import SortableHeader from "@/components/tables/SortableHeader";

type ReviewerApplicationsTableProps = {
  assignments: InterviewAssignment[];
  search: string;
  rowCount?: number;
  statusFilter: "all" | "completed" | "pending";
  formId: string;
};

export default function ReviewerInterviewsTable({
  assignments,
  search,
  formId,
  rowCount = 20,
  statusFilter = "all",
}: ReviewerApplicationsTableProps) {
  const { user } = useAuth();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rowCount,
  });

  const columnHelper = createColumnHelper<InterviewAssignmentRow>();
  const cols = useMemo(
    () =>
      [
        columnHelper.accessor("index", {
          id: "number",
          header: ({ column }) => {
            return <SortableHeader column={column}>S. NO</SortableHeader>;
          },
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("applicantName", {
          id: "applicant-name",
          header: ({ column }) => {
            return <SortableHeader column={column}>APPLICANT</SortableHeader>;
          },
        }),
        columnHelper.accessor("role", {
          id: "role",
          header: ({ column }) => {
            return <SortableHeader column={column}>ROLE</SortableHeader>;
          },
          cell: ({ getValue }) => <ApplicantRolePill role={getValue()} />,
        }),
        columnHelper.accessor("score", {
          id: "score",
          header: ({ column }) => {
            return <SortableHeader column={column}>SCORE</SortableHeader>;
          },
          cell: ({ getValue, row }) => {
            const review = row.original.interviewReviewData;
            const score = getValue();
            if (!review?.submitted) {
              return "INC";
            } else {
              return score?.value && score?.outOf
                ? `${score.value}/${score.outOf}`
                : `N/A`;
            }
          },
        }),
        columnHelper.accessor("interviewReviewData", {
          id: "review-status",
          header: ({ column }) => {
            return <SortableHeader column={column}>ACTION</SortableHeader>;
          },
          cell: ({ getValue, row }) => {
            const review = getValue();
            const rowData = row.original;
            if (review) {
              return (
                <Button
                  disabled={review?.submitted}
                  onClick={() =>
                    handleInterview(
                      review,
                      rowData.applicant.id,
                      rowData.responseId,
                      rowData.role,
                    )
                  }
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  Edit
                </Button>
              );
            } else {
              return (
                <Button
                  onClick={() =>
                    handleInterview(
                      review,
                      rowData.applicant.id,
                      rowData.responseId,
                      rowData.role,
                    )
                  }
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  Interview
                </Button>
              );
            }
          },
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId) as
              | ApplicationInterviewData
              | undefined;

            if (filterValue == "all") return true;
            else if (filterValue == "pending") return !value;
            else if (filterValue == "completed") return !!value;
            else return true;
          },
        }),
      ] as ColumnDef<InterviewAssignmentRow>[],
    [columnHelper],
  );

  async function handleInterview(
    appReviewData: ApplicationInterviewData | undefined,
    applicantId: string,
    responseId: string,
    role: ApplicantRole,
  ) {
    // const form = await getApplicationForm(formId);
    if (appReviewData) {
      // there's an existing review, edit it
      if (appReviewData.submitted) {
        throwErrorToast("This review has already been submitted!");
      } else {
        //TODO: IMPLEMENT
        // navigate(
        // 	`/admin/review/f/${appReviewData.applicationFormId}/${responseId}/${form.sections[0].sectionId}/${appReviewData.id}`,
        // );
      }
    } else {
      const review: Omit<ApplicationInterviewData, "id"> = {
        applicantScores: {},
        applicantId: applicantId,
        applicationFormId: formId,
        applicationResponseId: responseId,
        forRole: role,
        interviewerId: user!.id,
        interviewNotes: "",
        submitted: false,
      };

      const newReview = await createInterviewData(review);
      console.log(newReview);

      //TODO: IMPLEMENT
      // navigate(
      // 	`/admin/review/f/${newReview.applicationFormId}/${responseId}/${form.sections[0].sectionId}/${newReview.id}`,
      // );
    }
  }

  const {
    data: rows,
    isPending,
    error,
  } = useRows(assignments, pagination.pageIndex, rowCount, formId);

  if (isPending || !rows) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="flex flex-col w-full gap-2">
      <DataTable
        columns={cols}
        data={rows}
        className="border-none rounded-none"
        options={{
          getPaginationRowModel: getPaginationRowModel(),
          manualPagination: true,
          onPaginationChange: setPagination,
          rowCount: rowCount,
          enableGlobalFilter: true,
          state: {
            globalFilter: search,
            pagination,
            columnFilters: [
              {
                id: "review-status",
                value: statusFilter,
              },
            ],
          },
        }}
      />
      <div className="flex flex-row gap-2">
        <span>
          Page {pagination.pageIndex + 1} of{" "}
          {Math.max(Math.ceil(assignments.length / rowCount), 1)}
        </span>
        <div className="ml-auto">
          <Button
            variant="outline"
            disabled={pagination.pageIndex <= 0}
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
              })
            }
          >
            Previous Page
          </Button>
          <Button
            variant="outline"
            disabled={
              (pagination.pageIndex + 1) * rowCount >= assignments.length
            }
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
              })
            }
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
