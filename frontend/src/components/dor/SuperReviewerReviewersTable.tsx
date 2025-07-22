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
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "../ui/command";
  import { useNavigate } from "react-router-dom";
import { getReviewAssignments } from "@/services/reviewAssignmentService";
import { getReviewDataForReviewer } from "@/services/reviewDataService";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { throwSuccessToast } from "../toasts/SuccessToast";
import { throwErrorToast } from "../toasts/ErrorToast";
import { setReviewerRolePreferences } from "@/services/userService";
import { applicantRoleColor, applicantRoleDarkColor, displayApplicantRoleName } from "@/utils/display";
import { getReviewerById, getRolePreferencesForReviewer } from "@/services/reviewersService";
import Spinner from "../Spinner";
import { useRolePreferencesForReviewer } from "@/hooks/useReviewers";
import ApplicantRolePill from "../role-pill/RolePill";
  
  type SuperReviewerReviewersTableProps = {
    reviewers: ReviewerUserProfile[];
    search: string;
    rowCount?: number;
    formId: string;
  };
  
  // todo: definitely incomplete, just trying to understand code rn
  type ReviewerRow = {
    index: number;
    reviewer: {
      name: string;
      id: string;
    };
    rolePreferences: ApplicantRole[];
    assignments: number;
    pendingAssignments: number;
  };

  type RoleSelectProps = {
    // onAdd: (role: ApplicantRole) => void;
    onDelete: (
      role: ApplicantRole,
      reviewerId: string,
    ) => void;
    // role: ApplicantRole;
    rolePreferences: ApplicantRole[];
    reviewerId: string;
    disabled?: boolean;
  };

  type RoleSearchPopoverProps = {
    reviewerId: string;
    onSelect?: (role: ApplicantRole) => void;
  };
  
  function RoleSearchPopover({
    reviewerId,
    onSelect,
  }: RoleSearchPopoverProps) {  
    const { data: rolePreferences, isPending, error } = useRolePreferencesForReviewer(reviewerId);
    const roles = Object.values(ApplicantRole)
  
    if (isPending)
      return (
        <div className="flex items-center justify-center p-2 w-full">
          <Spinner />
        </div>
      );
  
    if (error)
      return (
        <div className="flex items-center justify-center p-2 w-full">
          <p>Failed to fetch roles preferences: {error.message}</p>
        </div>
      );
  
    return (
      <Command>
        <CommandInput placeholder="Search Roles..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {roles
              ?.filter((r) => !rolePreferences.includes(r))
              .map((role) => {
                return (
                  <CommandItem
                    key={role}
                    value={displayApplicantRoleName(role)}
                    className="cursor-pointer flex flex-col gap-1 items-start"
                    // onSelect={() => onSelect(role)}
                  >
                    <ApplicantRolePill role={role} />
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  function RoleSelect({
    // onAdd,
    onDelete,
    // role,
    rolePreferences,
    reviewerId,
    disabled = false,
  }: RoleSelectProps) {
    const [showPopover, setShowPopover] = useState(false);
  
    return (
      <div className="flex flex-wrap items-center gap-1 max-h-20 max-w-64 overflow-y-scroll no-scrollbar">
        {rolePreferences.map((role, _) => (
          // TODO: have this use the role pill
          <div
            key={role}
            style={{
              backgroundColor: applicantRoleColor(role),
              color: applicantRoleDarkColor(role),
            }}
            className={`rounded-full h-7 px-2 py-1 bg-muted text-sm flex flex-row gap-1 items-center`}
          >
            <span className="text-sm">
              {displayApplicantRoleName(role)}
            </span>
            <Button
              disabled={disabled}
              variant="ghost"
              className="size-3"
              onClick={() => onDelete(role, reviewerId)}
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
            <RoleSearchPopover
              reviewerId={reviewerId}
              // onSelect={onAdd}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
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
                rolePreferences: (await getRolePreferencesForReviewer(reviewer.id)),
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

    const removeRolePreferenceMutation = useMutation({
      mutationFn: async ({
        roleToRemove,
        reviewerId
      }: {
        roleToRemove: ApplicantRole;
        reviewerId: string;
        pageIndex: number;
      }) => {
        const prevRolePreferences = (await getReviewerById(reviewerId)).applicantRolePreferences 
        const newRolePreferences = prevRolePreferences.filter(role => role != roleToRemove);
        return await setReviewerRolePreferences(reviewerId, newRolePreferences)
      },
      onSuccess: () => {
        throwSuccessToast("Successfully removed role preference!");
      },
      onError: (error) => {
        throwErrorToast(
          `Failed to remove role preference! (${error.message})`,
        );
        console.log(error);
      },
      onSettled: (_data, _err, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["all-reviewers-rows", variables.pageIndex],
        });
      },
    });
  
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
          columnHelper.accessor("rolePreferences", {
            id: "role-preferences",
            header: "ROLES REVIEWING",
            cell: ({ getValue, row }) => {
              return (
                <RoleSelect
                  rolePreferences={getValue()}
                  // onAdd={(reviewer) =>
                  //   addReviewerMutation.mutate({
                  //     pageIndex: pagination.pageIndex,
                  //     reviewer: reviewer,
                  //     responseId: rowData.responseId,
                  //     role: role,
                  //   })
                  // }
                  onDelete={(role, reviewerId) =>
                    removeRolePreferenceMutation.mutate({
                      pageIndex: pagination.pageIndex,
                      roleToRemove: role,
                      reviewerId: reviewerId,
                    })
                  }
                  reviewerId={row.original.reviewer.id}
                />
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
                        navigate("/admin/dor/applications/" + formId + "/" + row.original.reviewer.id)
                      }}
                    >
                      View Applications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
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
  