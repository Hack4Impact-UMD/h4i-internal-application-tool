import { ApplicationReviewData, AppReviewAssignment } from "@/types/types";
import {
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getApplicationForm } from "@/services/applicationFormsService";
import ApplicantRolePill from "@/components/role-pill/RolePill";
import { AssignedAppRow, useRows } from "./useRows";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import SortableHeader from "@/components/tables/SortableHeader";

type AssignedReviewsTableProps = {
  assignments: AppReviewAssignment[];
  search: string;
  rowCount?: number;
  statusFilter: "all" | "reviewed" | "pending";
  formId: string;
};

export default function AssignedReviewsTable({
  assignments,
  search,
  formId,
  rowCount = 20,
  statusFilter = "all",
}: AssignedReviewsTableProps) {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rowCount,
  });

  const columnHelper = createColumnHelper<AssignedAppRow>();
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
        columnHelper.accessor("reviewerName", {
          id: "reviewer",
          header: ({ column }) => {
            return <SortableHeader column={column}>REVIEWER</SortableHeader>;
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
          cell: ({ getValue }) => {
            const score = getValue();
            if (!score) {
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
            if (review?.submitted) {
              return (
                <Button
                  onClick={() => handleReview(review, rowData.responseId)}
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  View Review
                </Button>
              );
            } else if (review) {
              return "Review In Progress";
            } else {
              return "Not Reviewed";
            }
          },
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId) as
              | ApplicationReviewData
              | undefined;

            if (filterValue == "all") return true;
            else if (filterValue == "pending")
              return !(value?.submitted ?? false);
            else if (filterValue == "reviewed")
              return value?.submitted ?? false;
            else return true;
          },
        }),
      ] as ColumnDef<AssignedAppRow>[],
    [columnHelper],
  );

  async function handleReview(
    appReviewData: ApplicationReviewData | undefined,
    responseId: string,
  ) {
    const form = await getApplicationForm(formId);
    if (appReviewData) {
      // there's an existing review, edit it
      navigate(
        `/admin/review/f/${appReviewData.applicationFormId}/${responseId}/${form.sections[0].sectionId}/${appReviewData.id}?edit=false`,
      );
    } else {
      throwErrorToast("Review data does not exist!");
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
