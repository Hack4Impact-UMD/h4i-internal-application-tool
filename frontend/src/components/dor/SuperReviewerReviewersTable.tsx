import {
    ApplicantRole,
    ReviewerUserProfile,
  } from "@/types/types";
  import {
    ColumnDef,
    createColumnHelper,
    getPaginationRowModel,
  } from "@tanstack/react-table";
  import { useMemo, useState } from "react";
  import { DataTable } from "../DataTable";
  import { Button } from "../ui/button";
  import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    EllipsisVertical,
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";
import { getReviewAssignments } from "@/services/reviewAssignmentService";
import { getReviewDataForReviewer } from "@/services/reviewDataService";
  
  type SuperReviewerReviewersTableProps = {
    reviewers: ReviewerUserProfile[];
    search: string;
    rowCount?: number;
    formId: string;
  };
  
  // todo: definitely wrong, just trying to understand code rn
  type ReviewerRow = {
    index: number;
    reviewer: {
      name: string;
      id: string;
    };
    rolesReviewing: ApplicantRole[];
    assignments: number;
    pendingAssignments: number;
  };
  
  function useRows(
    pageIndex: number,
    reviewers: ReviewerUserProfile[],
    rowCount: number,
    formId: string,
  ) {
    return useQuery({
      queryKey: ["all-reviewers-rows", pageIndex],
      placeholderData: (prev) => prev,
      queryFn: async () => {
        return Promise.all(
          reviewers
            .slice(
              pageIndex * rowCount,
              Math.min(reviewers.length, (pageIndex + 1) * rowCount),
            )
            .map(async (reviewer, index) => {
              const assignments = (await getReviewAssignments(formId, reviewer.id));
              const reviewData = (await getReviewDataForReviewer(formId, reviewer.id))

              const row: ReviewerRow = {
                index: 1 + pageIndex * rowCount + index,
                reviewer: {
                  id: reviewer.id,
                  name: `${reviewer.firstName} ${reviewer.lastName}`,
                },
                rolesReviewing: [],
                assignments: assignments.length,
                pendingAssignments: reviewData.filter((data) => {data.submitted == false}).length,
              };
  
              return row;
            }),
        );
      },
    });
  }
  
  export default function SuperReviewerReviewersTable({
    reviewers,
    search,
    formId,
    rowCount = 20,
  }: SuperReviewerReviewersTableProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: rowCount,
    });
  
    const columnHelper = createColumnHelper<ReviewerRow>();
    const cols = useMemo(
      () =>
        [
          columnHelper.accessor("index", {
            id: "number",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  <span className="items-center flex flex-row gap-1">
                    S. NO
                    {column.getIsSorted() === false ? (
                      <ArrowUpDown />
                    ) : column.getIsSorted() === "desc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                  </span>
                </Button>
              );
            },
          }),
          columnHelper.accessor("reviewer.name", {
            id: "reviewer-name",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  <span className="items-center flex flex-row gap-1">
                    REVIEWER
                    {column.getIsSorted() === false ? (
                      <ArrowUpDown />
                    ) : column.getIsSorted() === "desc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                  </span>
                </Button>
              );
            },
          }),
          columnHelper.accessor("assignments", {
            id: "assignments",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  <span className="items-center flex flex-row gap-1">
                    ASSIGNMENTS
                    {column.getIsSorted() === false ? (
                      <ArrowUpDown />
                    ) : column.getIsSorted() === "desc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                  </span>
                </Button>
              );
            },
          }),
          columnHelper.accessor("pendingAssignments", {
            id: "pending-assignments",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  <span className="items-center flex flex-row gap-1">
                    PENDING
                    {column.getIsSorted() === false ? (
                      <ArrowUpDown />
                    ) : column.getIsSorted() === "desc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                  </span>
                </Button>
              );
            },
          }),
        ] as ColumnDef<ReviewerRow>[],
      [columnHelper],
    );
  
    const {
      data: rows,
      isPending,
      error,
    } = useRows(pagination.pageIndex, reviewers, rowCount, formId);
  
    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;
  
    return (
      <div className="flex flex-col w-full gap-2">
        <DataTable
          columns={cols}
          data={rows ?? []}
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
            },
          }}
        />
        <div className="flex flex-row gap-2">
          <span>
            Page {pagination.pageIndex + 1} of{" "}
            {Math.max(Math.ceil(reviewers.length / rowCount), 1)}
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
                (pagination.pageIndex + 1) * rowCount >= reviewers.length
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
  