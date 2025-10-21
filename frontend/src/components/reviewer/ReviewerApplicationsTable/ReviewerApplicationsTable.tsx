import {
  ApplicantRole,
  ApplicationReviewData,
  AppReviewAssignment,
  ReviewStatus,
} from "@/types/types";
import {
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { createReviewData } from "@/services/reviewDataService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getApplicationForm } from "@/services/applicationFormsService";
import ApplicantRolePill from "@/components/role-pill/RolePill";
import { AssignmentRow, useRows } from "./useRows";
import SortableHeader from "@/components/tables/SortableHeader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ReviewerApplicationsTableProps = {
  assignments: AppReviewAssignment[];
  search: string;
  rowCount?: number;
  statusFilter: "all" | "reviewed" | "pending";
  formId: string;
};

export default function ReviewerApplicationsTable({
  assignments,
  search,
  formId,
  rowCount = 20,
  statusFilter = "all",
}: ReviewerApplicationsTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rowCount,
  });

  const columnHelper = createColumnHelper<AssignmentRow>();
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
        columnHelper.accessor("applicant.name", {
          id: "applicant-name",
          header: ({ column }) => {
            return <SortableHeader column={column}>APPLICANT</SortableHeader>;
          },
          cell: ({ getValue, row }) => {
            const previouslyApplied = row.original.applicant.previouslyAppliedCount ?? 0;

            return (
              <span className="flex items-center">
                <span>{getValue()}</span>
                
                {previouslyApplied > 0 && (
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full cursor-default">
                        {previouslyApplied}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {previouslyApplied === 0
                        ? "No previous applications"
                        : `Applied in ${previouslyApplied} previous semester${previouslyApplied > 1 ? "s" : ""}`}
                    </TooltipContent>
                  </Tooltip>
                )}
            
              </span>
            );
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
            const review = row.original.review;
            const score = getValue();
            if (!review?.submitted) {
              return "INC";
            } else {
              return score.value && score.outOf
                ? `${score.value}/${score.outOf}`
                : `N/A`;
            }
          },
        }),
        columnHelper.accessor("review", {
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
                  onClick={() =>
                    handleReview(
                      review,
                      rowData.applicant.id,
                      rowData.responseId,
                      rowData.role,
                    )
                  }
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  {rowData.review?.submitted ? "View" : "Edit"}
                </Button>
              );
            } else {
              return (
                <Button
                  onClick={() =>
                    handleReview(
                      review,
                      rowData.applicant.id,
                      rowData.responseId,
                      rowData.role,
                    )
                  }
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  Review
                </Button>
              );
            }
          },
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId) as
              | ApplicationReviewData
              | undefined;

            const isReviewData = (v: unknown): v is ApplicationReviewData =>
              typeof v === "object" && v !== null && "submitted" in v;

            if (filterValue == "all") return true;
            else if (filterValue == "pending")
              return (
                !isReviewData(value) ||
                (isReviewData(value) && value.submitted === false)
              );
            else if (filterValue == "completed")
              return isReviewData(value) && value.submitted === true;
            else return true;
          },
        }),
      ] as ColumnDef<AssignmentRow>[],
    [columnHelper],
  );

  async function handleReview(
    appReviewData: ApplicationReviewData | undefined,
    applicantId: string,
    responseId: string,
    role: ApplicantRole,
  ) {
    const form = await getApplicationForm(formId);
    if (appReviewData) {
      // there's an existing review, edit it
      navigate(
        `/admin/review/f/${appReviewData.applicationFormId}/${responseId}/${form.sections[0].sectionId}/${appReviewData.id}`,
      );
    } else {
      const review = {
        applicantScores: {},
        applicantId: applicantId,
        applicationFormId: formId,
        applicationResponseId: responseId,
        forRole: role,
        reviewStatus: ReviewStatus.NotReviewed,
        reviewerId: user!.id,
        reviewerNotes: {},
        submitted: false,
      };

      console.log(review);

      const newReview = await createReviewData(review);
      navigate(
        `/admin/review/f/${newReview.applicationFormId}/${responseId}/${form.sections[0].sectionId}/${newReview.id}`,
      );
    }
  }

  const { data: rows, isPending, error } = useRows(assignments, formId);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="flex flex-col w-full gap-2">
      <DataTable
        columns={cols}
        data={rows}
        className="border-none rounded-none"
        options={{
          getPaginationRowModel: getPaginationRowModel(),
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
