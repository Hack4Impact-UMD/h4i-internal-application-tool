import {
  ApplicantRole,
  ApplicationResponse,
  ApplicationReviewData,
  AppReviewAssignment,
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
import { useQuery } from "@tanstack/react-query";
import { getApplicantById } from "@/services/applicantService";
import {
  getReviewDataForResponseRole,
} from "@/services/reviewDataService";
import {
  applicantRoleColor,
  applicantRoleDarkColor,
  displayApplicantRoleName,
} from "@/utils/display";
import { calculateReviewScore } from "@/utils/scores";
import { getUserById } from "@/services/userService";
import { getReviewAssignmentsForApplication } from "@/services/reviewAssignmentService";

type SuperReviewerApplicationsTableProps = {
  applications: ApplicationResponse[];
  search: string;
  rowCount?: number;
  roleFilter: "all" | ApplicantRole;
  formId: string;
};

type ApplicationRow = {
  index: number;
  applicant: {
    name: string;
    id: string;
  };
  responseId: string;
  role: ApplicantRole;
  reviews: {
    assigned: number;
    completed: number;
    averageScore: number;
    assignments: AppReviewAssignment[];
    reviewData: ApplicationReviewData[];
  };
  reviewers: {
    assigned: ReviewerUserProfile[]
  }
};

export default function SuperReviewerApplicationsTable({
  applications,
  search,
  formId,
  rowCount = 20,
  roleFilter = "all",
}: SuperReviewerApplicationsTableProps) {
  // const navigate = useNavigate();
  // const { user } = useAuth();

  function useRows(pageIndex: number) {
    return useQuery({
      queryKey: ["all-apps-rows", pageIndex],
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
              const reviews = await getReviewDataForResponseRole(formId, app.id, app.rolesApplied[0]);
              const assignments = await getReviewAssignmentsForApplication(app.id)

              const completedReviews = reviews.filter(r => r.submitted).length
              const avgScore = completedReviews == 0 ? 0 : (await Promise.all(reviews.filter(r => r.submitted).map(async (r) => await calculateReviewScore(r))))
                .reduce((acc, v) => acc + v, 0) / completedReviews


              const row: ApplicationRow = {
                index: 1 + pageIndex * rowCount + index,
                applicant: {
                  id: user.id,
                  name: `${user.firstName} ${user.lastName}`,
                },
                responseId: app.id,
                role: app.rolesApplied[0], //These have already been expanded into their separate roles
                reviews: {
                  assigned: assignments.length,
                  completed: reviews.filter(r => r.submitted).length,
                  assignments: assignments,
                  averageScore: avgScore,
                  reviewData: reviews
                },
                reviewers: {
                  assigned: await Promise.all(assignments.map(async assignment => await getUserById(assignment.reviewerId) as ReviewerUserProfile))
                }
              };

              return row;
            }),
        );
      },
    });
  }

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rowCount,
  });

  const columnHelper = createColumnHelper<ApplicationRow>();
  const cols = useMemo(
    () =>
      [
        columnHelper.accessor("index", {
          id: "number",
          header: "S. NO",
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("applicant.name", {
          id: "applicant-name",
          header: "APPLICANT",
        }),
        columnHelper.accessor("role", {
          id: "role",
          header: "ROLE",
          cell: ({ getValue }) => (
            <span
              style={{
                backgroundColor: applicantRoleColor(getValue()),
                color: applicantRoleDarkColor(getValue()),
              }}
              className={`rounded-full px-2 py-1`}
            >
              {displayApplicantRoleName(getValue())}
            </span>
          ),
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId)

            if (filterValue == "all") return true;
            else return filterValue == value;
          },
        }),
        columnHelper.accessor("reviewers.assigned", {
          id: "reviewers",
          header: "REVIEWERS",
          cell: ({ getValue }) => {
            const reviewers = getValue()
            return reviewers.length == 0 ? 'None Assigned' : reviewers.map(r => `${r.firstName} ${r.lastName}`).join(', ')
          },
        }),
        columnHelper.accessor("reviews.completed", {
          id: "assigned-reviews",
          header: "REV. COMPLETE",
          cell: ({ getValue, row }) => {
            const completed = getValue();
            const assigned = row.original.reviews.assigned

            return `${completed}/${assigned}`
          },
        }),
      ] as ColumnDef<ApplicationRow>[],
    [columnHelper],
  );

  const { data: rows, isPending, error } = useRows(pagination.pageIndex);

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
                id: "role",
                value: roleFilter,
              },
            ],
          },
        }}
      />
      <div className="flex flex-row gap-2">
        <span>
          Page {pagination.pageIndex + 1} of{" "}
          {Math.ceil(applications.length / rowCount)}
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
              (pagination.pageIndex + 1) * rowCount >= applications.length - 1
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
