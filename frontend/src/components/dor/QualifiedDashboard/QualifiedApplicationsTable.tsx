import { useMemo, useState, useCallback } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  ApplicantRole,
  ApplicationResponse,
  ReviewerUserProfile,
  ReviewStatus,
  InternalApplicationStatus,
} from "@/types/types";
import {
  createColumnHelper,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import RolePill from "@/components/role-pill/RolePill";
import { getInterviewAssignmentsForApplication } from "@/services/interviewAssignmentService";
import { useReviewersForRole } from "@/hooks/useReviewers";
import {
  assignInterview,
  removeInterviewAssignment,
} from "@/services/interviewAssignmentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { InterviewAssignment } from "@/types/types";
import Spinner from "@/components/Spinner";
import { ApplicationInterviewData } from "@/types/types";
import { QualifiedAppRow, useRows } from "./useRows";
import SortableHeader from "@/components/tables/SortableHeader";
import { updateApplicationStatus } from "@/services/statusService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function InterviewerSelect({
  onAdd,
  onDelete,
  role,
  interviewers,
  assignments,
  responseId,
  disabled = false,
  interviews,
}: {
  onAdd: (interviewer: ReviewerUserProfile) => void;
  onDelete: (
    interviewer: ReviewerUserProfile,
    assignment: InterviewAssignment,
  ) => void;
  role: ApplicantRole;
  interviewers: ReviewerUserProfile[];
  assignments: InterviewAssignment[];
  responseId: string;
  disabled?: boolean;
  interviews: ApplicationInterviewData[];
}) {
  const [showPopover, setShowPopover] = useState(false);
  // Check if interview is complete for a given interviewer
  const complete = useCallback(
    (interviewer: ReviewerUserProfile) => {
      return interviews.find(
        (interview) =>
          interview.submitted &&
          interview.interviewerId === interviewer.id &&
          interview.forRole === role,
      );
    },
    [interviews, role],
  );
  return (
    <div className="flex flex-wrap items-center gap-1 max-h-20 max-w-64 overflow-y-scroll no-scrollbar">
      {interviewers.map((interviewer, index) => (
        <div
          key={interviewer.id}
          className={`rounded-full border h-7 px-2 py-1 text-sm flex flex-row gap-1 items-center ${complete(interviewer) ? "bg-green-200 text-green-800 border-green-100" : "bg-muted"}`}
        >
          <span className="text-sm">
            {interviewer.firstName} {interviewer.lastName}
          </span>
          <Button
            disabled={disabled}
            variant="ghost"
            className="size-3 hover:bg-transparent"
            onClick={() => onDelete(interviewer, assignments[index])}
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
          <InterviewerSearchPopover
            responseId={responseId}
            role={role}
            onSelect={onAdd}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// InterviewerSearchPopover (modeled after ReviewerSearchPopover)
function InterviewerSearchPopover({
  role,
  responseId,
  onSelect,
}: {
  role: ApplicantRole;
  responseId: string;
  onSelect: (interviewer: ReviewerUserProfile) => void;
}) {
  const {
    data: interviewers,
    isPending: interviewersPending,
    error: interviewersError,
  } = useReviewersForRole(role);
  const {
    data: allAssignments,
    isPending: assignmentsPending,
    error: assignmentsError,
  } = useQuery({
    queryKey: ["interview-assignments", responseId],
    queryFn: () => getInterviewAssignmentsForApplication(responseId),
  });

  const validInterviewers = useMemo(() => {
    if (!interviewers || !allAssignments) {
      return [];
    }
    const assignmentsForRole = allAssignments.filter((a) => a.forRole === role);
    const assignedIds = new Set(assignmentsForRole.map((a) => a.interviewerId));
    return interviewers.filter((i) => !assignedIds.has(i.id));
  }, [interviewers, allAssignments, role]);

  const isPending = interviewersPending || assignmentsPending;
  const error = interviewersError || assignmentsError;

  if (isPending)
    return (
      <div className="flex items-center justify-center p-2 w-full">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center p-2 w-full">
        <p>Failed to fetch data: {error.message}</p>
      </div>
    );
  return (
    <Command>
      <CommandInput placeholder="Search Interviewers..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {validInterviewers?.map((interviewer) => (
            <CommandItem
              key={interviewer.id}
              value={`${interviewer.firstName} ${interviewer.lastName}`}
              className="cursor-pointer flex flex-col gap-1 items-start"
              onSelect={() => onSelect(interviewer)}
            >
              <p>
                {interviewer.firstName} {interviewer.lastName}
              </p>
              <div className="flex flex-wrap gap-1">
                {interviewer.applicantRolePreferences?.map((role) => (
                  <RolePill key={role} role={role} className="text-xs" />
                ))}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function StatusSelect({
  currentStatus,
  onStatusChange,
  disabled = false,
  assignedInterviewers,
}: {
  currentStatus: ReviewStatus;
  onStatusChange: (newStatus: ReviewStatus) => void;
  disabled?: boolean;
  assignedInterviewers: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStatus}
        onValueChange={onStatusChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {[
            ReviewStatus.UnderReview,
            ReviewStatus.Interview,
            ReviewStatus.Accepted,
            ReviewStatus.Waitlisted,
            ReviewStatus.Denied,
          ].map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentStatus === ReviewStatus.UnderReview && assignedInterviewers && (
        <Tooltip>
          <TooltipTrigger>
            <CircleAlertIcon className="text-orange-500" />
          </TooltipTrigger>
          <TooltipContent>
            Make sure to change status to interview if you plan to interview
            this applicant!
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
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
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      statusId,
      newStatus,
    }: {
      statusId: string;
      newStatus: ReviewStatus;
    }) => updateApplicationStatus(statusId, { status: newStatus }),
    onMutate: async ({ statusId, newStatus }) => {
      const queryKey = [
        "qualified-apps-rows",
        formId,
        pagination.pageIndex,
        rowCount,
      ];
      await queryClient.cancelQueries({ queryKey });

      const previousRows =
        queryClient.getQueryData<QualifiedAppRow[]>(queryKey);

      queryClient.setQueryData<QualifiedAppRow[]>(queryKey, (old) => {
        if (!old) return [];
        return old.map((row: QualifiedAppRow) => {
          if (row.status?.id === statusId) {
            return {
              ...row,
              status: {
                ...row.status,
                status: newStatus,
              } as InternalApplicationStatus,
            };
          }
          return row;
        });
      });

      return { previousRows, queryKey };
    },
    onError: (error, _vars, context) => {
      if (context?.previousRows) {
        queryClient.setQueryData(context.queryKey, context.previousRows);
      }
      throwErrorToast("Failed to update status!");
      console.error(error);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully updated status!");
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      } else {
        queryClient.invalidateQueries({
          predicate: (q) => q.queryKey.includes("qualified-apps-rows"),
        });
      }
    },
  });

  const addInterviewerMutation = useMutation({
    mutationFn: async ({
      interviewer,
      responseId,
      role,
    }: {
      interviewer: ReviewerUserProfile;
      responseId: string;
      role: ApplicantRole;
    }) => {
      return await assignInterview(responseId, interviewer.id, role);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully assigned interviewer!");
    },
    onError: (error) => {
      throwErrorToast("Failed to assign interviewer!");
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["qualified-apps-rows"],
      });
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey.includes("interview-assignments") ||
          q.queryKey.includes("interview") ||
          q.queryKey.includes("assignment"),
      });
    },
  });
  const removeInterviewerMutation = useMutation({
    mutationFn: async ({
      assignment,
      interviews,
    }: {
      assignment: InterviewAssignment;
      interviews: ApplicationInterviewData[];
    }) => {
      // Prevent removal if interview has started
      if (
        interviews.find(
          (i) => i.interviewerId === assignment.interviewerId && i.submitted,
        )
      ) {
        throw new Error(
          "The interviewer has already started their interview for this assignment. It is not possible to delete it.",
        );
      }
      return await removeInterviewAssignment(assignment.id);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully removed interviewer assignment!");
    },
    onError: (error) => {
      throwErrorToast(
        `Failed to remove interviewer assignment! (${error.message})`,
      );
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["qualified-apps-rows"],
      });
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey.includes("assignments") ||
          q.queryKey.includes("assignment"),
      });
    },
  });

  const {
    data: rows,
    isPending,
    error,
  } = useRows(pagination.pageIndex, applications, rowCount, formId);

  const columnHelper = createColumnHelper<QualifiedAppRow>();
  const cols = useMemo(
    () =>
      [
        columnHelper.accessor("index", {
          id: "number",
          header: ({ column }) => (
            <SortableHeader column={column}>S. NO</SortableHeader>
          ),
        }),
        columnHelper.accessor("name", {
          id: "name",
          header: ({ column }) => (
            <SortableHeader column={column}>NAME</SortableHeader>
          ),
        }),
        columnHelper.accessor("role", {
          id: "role",
          header: ({ column }) => (
            <SortableHeader column={column}>ROLE</SortableHeader>
          ),
          cell: ({ getValue }) => <RolePill role={getValue()} />,
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            if (filterValue === "all") return true;
            else return filterValue === value;
          },
        }),
        columnHelper.accessor("interviewers.assigned", {
          id: "interviewers",
          header: "INTERVIEWERS",
          cell: ({ getValue, row }) => {
            const rowData = row.original;
            return (
              <InterviewerSelect
                interviewers={getValue()}
                interviews={rowData.interviews}
                onAdd={(interviewer) =>
                  addInterviewerMutation.mutate({
                    interviewer: interviewer,
                    responseId: rowData.responseId,
                    role: rowData.role,
                  })
                }
                assignments={rowData.assignments}
                onDelete={(_interviewer, assignment) =>
                  removeInterviewerMutation.mutate({
                    assignment: assignment,
                    interviews: rowData.interviews,
                  })
                }
                responseId={rowData.responseId}
                role={rowData.role}
              />
            );
          },
        }),
        columnHelper.accessor("averageScore", {
          id: "avg-score",
          header: ({ column }) => (
            <SortableHeader column={column}>AVG. SCORE</SortableHeader>
          ),
          cell: ({ getValue }) => {
            const value = getValue();
            if (!value) return "N/A";
            return value.toFixed(2);
          },
        }),
        columnHelper.accessor("status.status", {
          id: "status",
          header: ({ column }) => (
            <SortableHeader column={column}>STATUS</SortableHeader>
          ),
          cell: ({ row }) => {
            const status = row.original.status;

            if (!status) {
              return "N/A";
            }

            return (
              <StatusSelect
                assignedInterviewers={row.original.assignments.length > 0}
                currentStatus={status.status}
                onStatusChange={(newStatus) => {
                  updateStatusMutation.mutate({
                    statusId: status.id,
                    newStatus,
                  });
                }}
                disabled={updateStatusMutation.isPending}
              />
            );
          },
        }),
      ] as ColumnDef<QualifiedAppRow>[],
    [
      columnHelper,
      addInterviewerMutation,
      removeInterviewerMutation,
      updateStatusMutation,
    ],
  );

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
