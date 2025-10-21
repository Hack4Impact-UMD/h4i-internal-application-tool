import {
  ApplicantRole,
  ApplicationResponse,
  AppReviewAssignment,
  InternalApplicationStatus,
  ReviewerUserProfile,
} from "@/types/types";
import {
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "../../DataTable";
import { Button } from "../../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviewDataForAssignment } from "@/services/reviewDataService";
import {
  assignReview,
  removeReviewAssignment,
} from "@/services/reviewAssignmentService";
import {
  EllipsisVertical,
  ClipboardIcon,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { throwSuccessToast } from "../../toasts/SuccessToast";
import { throwErrorToast } from "../../toasts/ErrorToast";
import ApplicantRolePill from "../../role-pill/RolePill";
import { updateApplicationStatus } from "@/services/statusService";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import SortableHeader from "../../tables/SortableHeader";
import { ApplicationRow, useRows } from "./useRows";
import { ReviewerSelect } from "./ReviewerSelect";
import { displayTimestamp } from "@/utils/dates";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SuperReviewerApplicationsTableProps = {
  applications: ApplicationResponse[];
  search: string;
  rowCount?: number;
  roleFilter: "all" | ApplicantRole;
  formId: string;
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addReviewerMutation = useMutation({
    mutationFn: async ({
      reviewer,
      responseId,
      role,
    }: {
      pageIndex: number;
      reviewer: ReviewerUserProfile;
      responseId: string;
      role: ApplicantRole;
    }) => {
      console.log("Adding assignment: ", reviewer.firstName, role, responseId);
      return await assignReview(responseId, reviewer.id, role);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully assigned reviewer!");
    },
    onError: (error) => {
      throwErrorToast("Failed to assign reviewer!");
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-apps-rows"],
      });
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey.includes("assignments") ||
          q.queryKey.includes("assignment"),
      });
    },
  });

  const removeReviewerMutation = useMutation({
    mutationFn: async ({
      assignment,
    }: {
      assignment: AppReviewAssignment;
      pageIndex: number;
    }) => {
      if ((await getReviewDataForAssignment(assignment)) !== undefined)
        throw new Error(
          "The reviewer has already started their review for this assignment. It is not possible to delete it.",
        );
      return await removeReviewAssignment(assignment.id);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully removed reviewer assignment!");
    },
    onError: (error) => {
      throwErrorToast(
        `Failed to remove reviewer assignment! (${error.message})`,
      );
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-apps-rows"],
      });
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey.includes("assignments") ||
          q.queryKey.includes("assignment"),
      });
    },
  });

  const toggleQualifiedMutation = useMutation({
    mutationFn: async ({ status }: { status: InternalApplicationStatus }) => {
      return await updateApplicationStatus(status.id, {
        isQualified: !status.isQualified,
      });
    },
    onMutate: async ({ status }) => {
      await queryClient.cancelQueries({
        queryKey: ["all-apps-rows"],
      });
      const oldRows = queryClient.getQueryData([
        "all-apps-rows",
        applications.map((a) => a.id).sort(),
        formId,
      ]);

      queryClient.setQueryData(
        ["all-apps-rows", applications.map((a) => a.id).sort(), formId],
        (old: ApplicationRow[]) =>
          old.map((row) => {
            if (row.status?.id === status.id) {
              return {
                ...row,
                status: {
                  ...status,
                  isQualified: !status.isQualified,
                },
              };
            } else {
              return row;
            }
          }),
      );

      return {
        oldRows,
      };
    },
    onError: (error, _resp, ctx) => {
      queryClient.setQueriesData({ queryKey: ["all-apps-rows"] }, ctx?.oldRows);
      throwErrorToast("Failed to update qualified status: " + error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-apps-rows"],
      });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes("qualified-apps-rows"),
      });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes("qualified-statuses"),
      });
    },
  });

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
            return <SortableHeader column={column}>S. NO</SortableHeader>;
          },
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("dateSubmitted", {
          id: "date-submitted",
          header: ({ column }) => {
            return <SortableHeader column={column}>DATE SUB.</SortableHeader>;
          },
          cell: ({ getValue }) => displayTimestamp(getValue()),
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
            )
            /*
            return (
              <span className="flex items-center">
                <span>{getValue()}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Clipboard
                      className="hover:bg-lightgray p-1 rounded cursor-pointer text-blue"
                      size={24}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            row.original.applicant.email,
                          );
                          throwSuccessToast(
                            `${row.original.applicant.email} added to clipboard!`,
                          );
                        } catch (err) {
                          console.log("Failed to copy email:");
                          console.log(err);
                          throwErrorToast(`Failed to add email to clipboard.`);
                        }
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Copy Applicant Email</TooltipContent>
                </Tooltip>
              </span>
            ); */
          },
        }),
        columnHelper.accessor("role", {
          id: "role",
          header: ({ column }) => {
            return <SortableHeader column={column}>ROLE</SortableHeader>;
          },
          cell: ({ getValue }) => <ApplicantRolePill role={getValue()} />,
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);

            if (filterValue == "all") return true;
            else return filterValue == value;
          },
        }),
        columnHelper.accessor("reviewers.assigned", {
          id: "reviewers",
          header: "REVIEWERS",
          cell: ({ getValue, row }) => {
            const rowData = row.original;
            const role = rowData.role;
            return (
              <ReviewerSelect
                reviewers={getValue()}
                reviews={row.original.reviews.reviewData}
                onAdd={(reviewer) =>
                  addReviewerMutation.mutate({
                    pageIndex: pagination.pageIndex,
                    reviewer: reviewer,
                    responseId: rowData.responseId,
                    role: role,
                  })
                }
                assignments={row.original.assignments}
                onDelete={(_reviewer, assignment) =>
                  removeReviewerMutation.mutate({
                    pageIndex: pagination.pageIndex,
                    assignment: assignment,
                  })
                }
                responseId={row.original.responseId}
                role={role}
              />
            );
          },
        }),
        columnHelper.accessor("reviews.completed", {
          id: "assigned-reviews",
          header: ({ column }) => {
            return (
              <SortableHeader column={column}>REV. COMPLETE</SortableHeader>
            );
          },
          cell: ({ getValue, row }) => {
            const completed = getValue();
            const assigned = row.original.reviews.assigned;

            return `${completed}/${assigned}`;
          },
        }),
        columnHelper.accessor("reviews.averageScore", {
          id: "avg-score",
          header: ({ column }) => {
            return <SortableHeader column={column}>AVG. SCORE</SortableHeader>;
          },
          cell: ({ getValue, row }) => {
            if (row.original.reviews.completed == 0) return "N/A";
            const hasLowScore = row.original.reviews.reviewData.some(
              (reviewData) =>
                reviewData.submitted &&
                Object.values(reviewData.applicantScores).some(
                  (score) => score < 2,
                ),
            );
            return (
              <div className="flex items-center">
                {getValue()}
                {hasLowScore && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-amber-100 rounded-full w-6 h-6 ml-1 flex items-center justify-center -mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        This candidate received a score below 2 from a reviewer
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          },
        }),
        columnHelper.accessor("status.isQualified", {
          id: "qualified",
          cell: ({ getValue, row }) => {
            const status = row.original.status;
            return (
              <div className="flex items-center justify-center">
                <Checkbox
                  className="size-5"
                  checked={getValue()}
                  onClick={() =>
                    status
                      ? toggleQualifiedMutation.mutate({
                          status: status,
                        })
                      : throwErrorToast("No status available!")
                  }
                />
              </div>
            );
          },
          header: () => {
            return (
              <div className="flex items-center justify-center">
                <span className="text-center mx-auto">QUALIFIED</span>
              </div>
            );
          },
        }),
        columnHelper.display({
          id: "actions",
          header: () => (
            <div className="flex items-center justify-center">
              <span className="text-center mx-auto">ACTIONS</span>
            </div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      navigate("/admin/dor/reviews/" + row.original.responseId);
                    }}
                  >
                    View Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(
                        `/admin/dor/application/${formId}/${row.original.responseId}`,
                      );
                    }}
                  >
                    View Application
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
      ] as ColumnDef<ApplicationRow>[],
    [
      addReviewerMutation,
      columnHelper,
      formId,
      navigate,
      pagination.pageIndex,
      removeReviewerMutation,
      toggleQualifiedMutation,
    ],
  );

  const { data: rows, isPending, error } = useRows(applications, formId);

  const handleCopy = useCallback(async () => {
    if (!rows) {
      throwErrorToast("No applicants found!");
      return;
    }

    const emails = new Set(rows.map((r) => r.applicant.email));
    const text = [...emails].join(",");

    try {
      await navigator.clipboard.writeText(text);
      throwSuccessToast(`Copied ${emails.size} email(s)!`);
    } catch (err) {
      console.log("Failed to copy emails: ", err);
      throwErrorToast("Failed to copy emails");
    }
  }, [rows]);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="mt-2 flex items-end">
        <Button
          className="ml-auto"
          disabled={!rows || rows.length == 0}
          variant={"outline"}
          onClick={() => handleCopy()}
        >
          <ClipboardIcon /> Copy all applicant emails
        </Button>
      </div>
      <DataTable
        columns={cols}
        data={rows ?? []}
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
          {Math.max(Math.ceil(applications.length / rowCount), 1)}
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
              (pagination.pageIndex + 1) * rowCount >= applications.length
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
