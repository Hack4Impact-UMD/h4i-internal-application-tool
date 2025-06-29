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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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

type ReviewerSelectProps = {
  onAdd: (reviewer: ReviewerUserProfile) => void
  onDelete: (reviewer: ReviewerUserProfile) => void
  role: ApplicantRole,
  reviewers: ReviewerUserProfile[]
}

function ReviewerSelect({ onAdd, onDelete, role, reviewers }: ReviewerSelectProps) {
  return <div className="flex flex-wrap items-center gap-1 max-h-20 max-w-64 overflow-y-scroll">
    {
      reviewers.map(reviewer => <div
        className={`rounded-full border h-7 px-2 py-1 bg-muted text-sm flex flex-row gap-1 items-center`}
      >
        <span className="text-sm">
          {reviewer.firstName} {reviewer.lastName}
        </span>
        <Button variant="ghost" className="size-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>)
    }
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" className="rounded-full text-sm h-7 font-normal p-0">
          Assign
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-32">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Assign Reviewer</h4>
            <p className="text-muted-foreground text-sm">
              Search for and select a reviewer below
            </p>
            <Input />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
}

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
          header: ({ column }) => {
            return <Button
              variant="ghost"
              className="p-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="items-center flex flex-row gap-1">
                S. NO
                {column.getIsSorted() === false ? <ArrowUpDown />
                  : column.getIsSorted() === 'desc' ? <ArrowUp /> : <ArrowDown />}
              </span>
            </Button>
          },
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("applicant.name", {
          id: "applicant-name",
          header: ({ column }) => {
            return <Button
              variant="ghost"
              className="p-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="items-center flex flex-row gap-1">
                APPLICANT
                {column.getIsSorted() === false ? <ArrowUpDown />
                  : column.getIsSorted() === 'desc' ? <ArrowUp /> : <ArrowDown />}
              </span>
            </Button>
          },
        }),
        columnHelper.accessor("role", {
          id: "role",
          header: ({ column }) => {
            return <Button
              variant="ghost"
              className="p-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="items-center flex flex-row gap-1">
                ROLE
                {column.getIsSorted() === false ? <ArrowUpDown />
                  : column.getIsSorted() === 'desc' ? <ArrowUp /> : <ArrowDown />}
              </span>
            </Button>
          },
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
          cell: ({ getValue, row }) => {
            const role = row.original.role
            return <ReviewerSelect
              reviewers={getValue()}
              onAdd={() => console.log("add")}
              onDelete={() => console.log("delete")}
              role={role} />
          },
        }),
        columnHelper.accessor("reviews.completed", {
          id: "assigned-reviews",
          header: ({ column }) => {
            return <Button
              variant="ghost"
              className="p-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="items-center flex flex-row gap-1">
                REV. COMPLETE
                {column.getIsSorted() === false ? <ArrowUpDown />
                  : column.getIsSorted() === 'desc' ? <ArrowUp /> : <ArrowDown />}
              </span>
            </Button>
          },
          cell: ({ getValue, row }) => {
            const completed = getValue();
            const assigned = row.original.reviews.assigned

            return `${completed}/${assigned}`
          },
        }),
        columnHelper.accessor("reviews.averageScore", {
          id: "avg-score",
          header: ({ column }) => {
            return <Button
              variant="ghost"
              className="p-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="items-center flex flex-row gap-1">
                AVG. SCORE
                {column.getIsSorted() === false ? <ArrowUpDown />
                  : column.getIsSorted() === 'desc' ? <ArrowUp /> : <ArrowDown />}
              </span>
            </Button>
          },
          cell: ({ getValue, row }) => {
            if (row.original.reviews.completed == 0) return 'N/A'
            return getValue()
          },
        }),
      ] as ColumnDef<ApplicationRow>[],
    [columnHelper],
  );

  const { data: rows, isPending, error } = useRows(pagination.pageIndex);

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
