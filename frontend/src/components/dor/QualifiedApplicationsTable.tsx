import { useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import { Button } from "../ui/button";
import { ApplicantRole, ApplicationResponse } from "@/types/types";
import { createColumnHelper, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";
import { getApplicantById } from "@/services/applicantService";
import { getReviewDataForResponseRole } from "@/services/reviewDataService";
import { useQuery } from "@tanstack/react-query";
import RolePill from "../role-pill/RolePill";
import { calculateReviewScore } from "@/utils/scores";
import { getUserById } from "@/services/userService";

// TODO: add interviewer-related logic once the related service functions are written 

function useRows(
  pageIndex: number,
  applications: ApplicationResponse[],
  rowCount: number,
  formId: string,
) {
  return useQuery({
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
            const reviews = await getReviewDataForResponseRole(
              formId,
              app.id,
              app.rolesApplied[0],
            );
            const submittedReviews = reviews.filter((r) => r.submitted);
            const sortedReviews = [...submittedReviews].sort((a, b) => a.reviewerId.localeCompare(b.reviewerId));
            const reviewer1 = sortedReviews[0]
              ? await getUserById(sortedReviews[0].reviewerId)
              : undefined;
            const reviewer2 = sortedReviews[1]
              ? await getUserById(sortedReviews[1].reviewerId)
              : undefined;
            const score1 = sortedReviews[0]
              ? await calculateReviewScore(sortedReviews[0])
              : undefined;
            const score2 = sortedReviews[1]
              ? await calculateReviewScore(sortedReviews[1])
              : undefined;
            
            return {
              index: 1 + pageIndex * rowCount + index,
              name: `${user.firstName} ${user.lastName}`,
              role: app.rolesApplied[0],
              interviewer1: reviewer1 ? `${reviewer1.firstName} ${reviewer1.lastName}` : "-",
              score1: score1 !== undefined ? `${score1}/12` : "-",
              interviewer2: reviewer2 ? `${reviewer2.firstName} ${reviewer2.lastName}` : "-",
              score2: score2 !== undefined ? `${score2}/12` : "-",
              total: (() => {
                if (score1 !== undefined && score2 !== undefined) return `${score1 + score2}/24`;
                if (score1 !== undefined) return `${score1}/12`;
                return "-";
              })(),
            };
          }),
      );
    },
    refetchOnWindowFocus: true, // Refetch when user switches back to this tab
  });
}

export default function QualifiedApplicationsTable({
  applications,
  search,
  formId,
  rowCount = 20,
  roleFilter = "all",
}: {
  applications: ApplicationResponse[];
  search: string;
  formId: string;
  rowCount?: number;
  roleFilter: "all" | ApplicantRole;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rowCount,
  });

  interface QualifiedApplicationRow {
    index: number;
    name: string;
    role: ApplicantRole;
    interviewer1: string;
    score1: string;
    interviewer2: string;
    score2: string;
    total: string;
  }

  const columnHelper = createColumnHelper<QualifiedApplicationRow>();
  const cols = useMemo<ColumnDef<QualifiedApplicationRow, any>[]>(
    () => [
      columnHelper.accessor("index", {
        id: "number",
        header: "S.NO",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: "NAME",
      }),
      columnHelper.accessor("role", {
        id: "role",
        header: "ROLES",
        cell: ({ getValue }) => <RolePill role={getValue()} />,
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId);
          if (filterValue === "all") return true;
          else return filterValue === value;
        },
      }),
      columnHelper.accessor("interviewer1", {
        id: "interviewer1",
        header: "INTERVIEWER 1",
      }),
      columnHelper.accessor("score1", {
        id: "score1",
        header: "SCORE",
      }),
      columnHelper.accessor("interviewer2", {
        id: "interviewer2",
        header: "INTERVIEWER 2",
      }),
      columnHelper.accessor("score2", {
        id: "score2",
        header: "SCORE",
      }),
      columnHelper.accessor("total", {
        id: "total",
        header: "TOTAL",
      }),
    ],
    [columnHelper],
  );

  const {
    data: rows,
    isPending,
    error,
  } = useRows(pagination.pageIndex, applications, rowCount, formId);

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
            columnFilters: [
              {
                id: "role",
                value: roleFilter,
              },
            ],
            sorting: [
              { id: "number", desc: false },
            ],
          },
        }}
      />
      <div className="flex flex-row gap-2">
        <span>
          Page {pagination.pageIndex + 1} of {Math.max(Math.ceil(applications.length / rowCount), 1)}
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
            disabled={(pagination.pageIndex + 1) * rowCount >= applications.length}
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