import { useMemo, useState, useCallback } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ApplicantRole, ApplicationResponse, ReviewerUserProfile } from "@/types/types";
import { createColumnHelper, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";
import RolePill from "@/components/role-pill/RolePill";
import { getInterviewAssignmentsForApplication } from "@/services/interviewAssignmentService";
import { useReviewersForRole } from "@/hooks/useReviewers";
import { assignInterview } from "@/services/interviewAssignmentService";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { removeInterviewAssignment } from "@/services/interviewAssignmentService";
import type { InterviewAssignment } from "@/types/types";
import Spinner from "@/components/Spinner";
import { useParams } from "react-router-dom";
import { ApplicationInterviewData } from "@/types/types";
import { QualfiedAppRow, useRows } from "./useRows";
import SortableHeader from "@/components/tables/SortableHeader";

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
  onDelete: (interviewer: ReviewerUserProfile, assignment: InterviewAssignment) => void;
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
  const { formId } = useParams<{ formId: string }>();
  const { data: interviewers, isPending, error } = useReviewersForRole(role);
  const assignments = useQueries({
    queries:
      interviewers?.map((interviewer) => ({
        queryKey: ["interview-assignments", "id", formId!, interviewer.id],
        queryFn: async () => (await getInterviewAssignmentsForApplication(responseId)).filter(a => a.forRole === role),
      })) ?? [],
  });

  const validInterviewers = useMemo(() => {
    return interviewers?.filter((_, index) => {
      const query = assignments[index];
      if (query.data) {
        const interviewerAssignments = query.data;
        return !interviewerAssignments.find(
          (a) => a.applicationResponseId == responseId && a.forRole == role,
        );
      } else {
        return true;
      }
    });
  }, [interviewers, assignments, responseId, role]);

  if (isPending)
    return (
      <div className="flex items-center justify-center p-2 w-full">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center p-2 w-full">
        <p>Failed to fetch interviewers: {error.message}</p>
      </div>
    );
  return (
    <Command>
      <CommandInput placeholder="Search Interviewers..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {validInterviewers
            ?.filter((r) => interviewers?.find((x) => x.id == r.id))
            .map((interviewer) => (
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
  const addInterviewerMutation = useMutation({
    mutationFn: async ({ interviewer, responseId, role }: { interviewer: ReviewerUserProfile; responseId: string; role: ApplicantRole }) => {
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
        predicate: (q) => q.queryKey.includes("interview-assignments") || q.queryKey.includes("interview") || q.queryKey.includes("assignment"),
      });
    },
  });
  const removeInterviewerMutation = useMutation({
    mutationFn: async ({ assignment, interviews }: { assignment: InterviewAssignment; interviews: ApplicationInterviewData[]; }) => {
      // Prevent removal if interview has started
      if (interviews.find((i) => i.interviewerId === assignment.interviewerId && i.submitted)) {
        throw new Error("The interviewer has already started their interview for this assignment. It is not possible to delete it.");
      }
      return await removeInterviewAssignment(assignment.id);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully removed interviewer assignment!");
    },
    onError: (error) => {
      throwErrorToast(`Failed to remove interviewer assignment! (${error.message})`);
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["qualified-apps-rows"],
      });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes("assignments") || q.queryKey.includes("assignment"),
      });
    },
  });

  const {
    data: rows,
    isPending,
    error,
  } = useRows(pagination.pageIndex, applications, rowCount, formId);

  const columnHelper = createColumnHelper<QualfiedAppRow>();
  const cols = useMemo(
    () => [
      columnHelper.accessor("index", {
        id: "number",
        header: ({ column }) => (
          <SortableHeader column={column}>
            S. NO
          </SortableHeader>
        ),
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: ({ column }) => (
          <SortableHeader column={column}>
            NAME
          </SortableHeader>
        ),
      }),
      columnHelper.accessor("role", {
        id: "role",
        header: ({ column }) => (
          <SortableHeader column={column}>
            ROLE
          </SortableHeader>
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
          <SortableHeader column={column}>
            AVG. SCORE
          </SortableHeader>
        ),
        cell: ({ getValue, row }) => {
          if (row.original.averageScore == null) return "N/A";
          return getValue();
        },
      }),
    ] as ColumnDef<QualfiedAppRow>[],
    [columnHelper, addInterviewerMutation, removeInterviewerMutation],
  );

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {JSON.stringify(error)}</p>;

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
