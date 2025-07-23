import {
  ApplicantRole,
  ApplicationResponse,
  ApplicationReviewData,
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
import { DataTable } from "../DataTable";
import { Button } from "../ui/button";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getApplicantById } from "@/services/applicantService";
import {
  getReviewDataForAssignment,
  getReviewDataForResponseRole,
} from "@/services/reviewDataService";
import { calculateReviewScore } from "@/utils/scores";
import { getUserById } from "@/services/userService";
import {
  assignReview,
  getReviewAssignments,
  getReviewAssignmentsForApplication,
  removeReviewAssignment,
} from "@/services/reviewAssignmentService";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EllipsisVertical,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useReviewersForRole } from "@/hooks/useReviewers";
import Spinner from "../Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { throwSuccessToast } from "../toasts/SuccessToast";
import { throwErrorToast } from "../toasts/ErrorToast";
import ApplicantRolePill from "../role-pill/RolePill";
import {
  getApplicationStatusForResponseRole,
  updateApplicationStatus,
} from "@/services/statusService";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
    assigned: ReviewerUserProfile[];
  };
  assignments: AppReviewAssignment[];
  status: InternalApplicationStatus | undefined;
};

type ReviewerSelectProps = {
  onAdd: (reviewer: ReviewerUserProfile) => void;
  onDelete: (
    reviewer: ReviewerUserProfile,
    assignment: AppReviewAssignment,
  ) => void;
  role: ApplicantRole;
  reviewers: ReviewerUserProfile[];
  assignments: AppReviewAssignment[];
  responseId: string;
  disabled?: boolean;
  reviews: ApplicationReviewData[];
};

type ReviewerSearchPopoverProps = {
  role: ApplicantRole;
  onSelect: (reviewer: ReviewerUserProfile) => void;
  responseId: string;
};

function ReviewerSearchPopover({
  role,
  responseId,
  onSelect,
}: ReviewerSearchPopoverProps) {
  const { formId } = useParams<{ formId: string }>();

  const { data: reviewers, isPending, error } = useReviewersForRole(role);
  const assignments = useQueries({
    queries:
      reviewers?.map((reviewer) => ({
        queryKey: ["assignments", "id", formId!, reviewer.id],
        queryFn: () => getReviewAssignments(formId!, reviewer.id),
      })) ?? [],
  });

  const validReviewers = useMemo(() => {
    return reviewers?.filter((_, index) => {
      const query = assignments[index];

      if (query.data) {
        const reviewerAssignments = query.data;
        return !reviewerAssignments.find(
          (a) => a.applicationResponseId == responseId && a.forRole == role,
        );
      } else {
        return true;
      }
    });
  }, [reviewers, assignments, responseId]);

  if (isPending)
    return (
      <div className="flex items-center justify-center p-2 w-full">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-2 w-full">
        <p>Failed to fetch reviewers: {error.message}</p>
      </div>
    );

  return (
    <Command>
      <CommandInput placeholder="Search Reviewers..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {validReviewers
            ?.filter((r) => reviewers?.find((x) => x.id == r.id))
            .map((reviewer) => {
              const index = reviewers!.findIndex((r) => r.id === reviewer.id);
              return (
                <CommandItem
                  key={reviewer.id}
                  value={`${reviewer.firstName} ${reviewer.lastName}`}
                  className="cursor-pointer flex flex-col gap-1 items-start"
                  onSelect={() => onSelect(reviewer)}
                >
                  <p>
                    {reviewer.firstName} {reviewer.lastName}{" "}
                    {assignments[index].isPending ? (
                      <Spinner className="size-3 inline ml-2" />
                    ) : assignments[index].error ? (
                      "N/A"
                    ) : (
                      `(${assignments[index].data?.length ?? "N/A"})`
                    )}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {reviewer.applicantRolePreferences.map((role) => (
                      <ApplicantRolePill
                        key={role}
                        role={role}
                        className="text-xs"
                      />
                    ))}
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function ReviewerSelect({
  onAdd,
  onDelete,
  role,
  reviewers,
  responseId,
  disabled = false,
  assignments,
  reviews,
}: ReviewerSelectProps) {
  const [showPopover, setShowPopover] = useState(false);

  const complete = useCallback(
    (reviewer: ReviewerUserProfile) => {
      return reviews.find(
        (review) =>
          review.submitted &&
          review.reviewerId === reviewer.id &&
          review.forRole === role,
      );
    },
    [reviews, role],
  );

  return (
    <div className="flex flex-wrap items-center gap-1 max-h-20 max-w-64 overflow-y-scroll no-scrollbar">
      {reviewers.map((reviewer, index) => (
        <div
          key={reviewer.id}
          className={`rounded-full border h-7 px-2 py-1 text-sm flex flex-row gap-1 items-center ${complete(reviewer) ? "bg-green-200 text-green-800 border-green-100" : "bg-muted"}`}
        >
          <span className="text-sm">
            {reviewer.firstName} {reviewer.lastName}
          </span>
          <Button
            disabled={disabled}
            variant="ghost"
            className="size-3 hover:bg-transparent"
            onClick={() => onDelete(reviewer, assignments[index])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      ))}
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="rounded-full text-sm h-7 font-normal p-0"
            disabled={disabled}
          >
            Assign
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-h-32">
          <ReviewerSearchPopover
            responseId={responseId}
            role={role}
            onSelect={onAdd}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
function useRows(
  pageIndex: number,
  applications: ApplicationResponse[],
  rowCount: number,
  formId: string,
) {
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
            const reviews = await getReviewDataForResponseRole(
              formId,
              app.id,
              app.rolesApplied[0],
            );
            const assignments = (
              await getReviewAssignmentsForApplication(app.id)
            ).filter((a) => a.forRole === app.rolesApplied[0]);

            const completedReviews = reviews.filter((r) => r.submitted).length;
            const avgScore =
              completedReviews == 0
                ? 0
                : (
                    await Promise.all(
                      reviews
                        .filter((r) => r.submitted)
                        .map(async (r) => await calculateReviewScore(r)),
                    )
                  ).reduce((acc, v) => acc + v, 0) / completedReviews;
            let status: InternalApplicationStatus | undefined;

            try {
              status = await getApplicationStatusForResponseRole(
                app.id,
                app.rolesApplied[0],
              );
            } catch (error) {
              console.log(
                `Failed to fetch application status for application ${app.id}-${app.rolesApplied[0]}: ${error}`,
              );
              status = undefined;
            }
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
                completed: reviews.filter((r) => r.submitted).length,
                assignments: assignments,
                averageScore: avgScore,
                reviewData: reviews,
              },
              reviewers: {
                assigned: await Promise.all(
                  assignments.map(
                    async (assignment) =>
                      (await getUserById(
                        assignment.reviewerId,
                      )) as ReviewerUserProfile,
                  ),
                ),
              },
              assignments: assignments,
              status: status,
            };

            return row;
          }),
      );
    },
  });
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
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-apps-rows", variables.pageIndex],
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
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-apps-rows", variables.pageIndex],
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
        queryKey: ["all-apps-rows", pagination.pageIndex],
      });
      const oldRows = queryClient.getQueryData([
        "all-apps-rows",
        pagination.pageIndex,
      ]);

      queryClient.setQueryData(
        ["all-apps-rows", pagination.pageIndex],
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
      queryClient.setQueryData(
        ["all-apps-rows", pagination.pageIndex],
        ctx?.oldRows,
      );
      throwErrorToast("Failed to update qualified status: " + error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-apps-rows", pagination.pageIndex],
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
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("applicant.name", {
          id: "applicant-name",
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
                  APPLICANT
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
        columnHelper.accessor("role", {
          id: "role",
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
                  ROLE
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
              <Button
                variant="ghost"
                className="p-0"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                <span className="items-center flex flex-row gap-1">
                  REV. COMPLETE
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
          cell: ({ getValue, row }) => {
            const completed = getValue();
            const assigned = row.original.reviews.assigned;

            return `${completed}/${assigned}`;
          },
        }),
        columnHelper.accessor("reviews.averageScore", {
          id: "avg-score",
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
                  AVG. SCORE
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
          cell: ({ getValue, row }) => {
            if (row.original.reviews.completed == 0) return "N/A";
            return getValue();
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
