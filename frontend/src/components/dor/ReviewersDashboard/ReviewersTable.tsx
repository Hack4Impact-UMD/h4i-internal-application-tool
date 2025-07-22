import { ApplicantRole, ReviewerUserProfile } from "@/types/types";
import {
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../DataTable";
import { Button } from "../../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EllipsisVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { ReviewerRow, useRows } from "./useRows";
import { RoleSelect } from "./RoleSelect";
import { getReviewerById } from "@/services/reviewersService";
import { setReviewerRolePreferences } from "@/services/userService";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { throwErrorToast } from "@/components/toasts/ErrorToast";

type ReviewersTableProps = {
  reviewers: ReviewerUserProfile[];
  search: string;
  rowCount?: number;
  formId: string;
};

export default function ReviewersTable({
  reviewers,
  search,
  formId,
  rowCount = 20,
}: ReviewersTableProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addRolePreferenceMutation = useMutation({
    mutationFn: async ({
      roleToAdd,
      reviewerId,
    }: {
      roleToAdd: ApplicantRole;
      reviewerId: string;
      pageIndex: number;
    }) => {
      const rolePreferences = (await getReviewerById(reviewerId))
        .applicantRolePreferences;
      rolePreferences.push(roleToAdd);
      return await setReviewerRolePreferences(reviewerId, rolePreferences);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully added role preference!");
    },
    onError: (error) => {
      throwErrorToast(`Failed to add role preference! (${error.message})`);
      console.log(error);
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-reviewers-rows", variables.pageIndex],
      });
    },
  });

  const removeRolePreferenceMutation = useMutation({
    mutationFn: async ({
      roleToRemove,
      reviewerId,
    }: {
      roleToRemove: ApplicantRole;
      reviewerId: string;
      pageIndex: number;
    }) => {
      const prevRolePreferences = (await getReviewerById(reviewerId))
        .applicantRolePreferences;
      const newRolePreferences = prevRolePreferences.filter(
        (role) => role != roleToRemove,
      );
      return await setReviewerRolePreferences(reviewerId, newRolePreferences);
    },
    onSuccess: () => {
      throwSuccessToast("Successfully removed role preference!");
    },
    onError: (error) => {
      throwErrorToast(`Failed to remove role preference! (${error.message})`);
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
                onAdd={(role, reviewerId) =>
                  addRolePreferenceMutation.mutate({
                    pageIndex: pagination.pageIndex,
                    roleToAdd: role,
                    reviewerId: reviewerId,
                  })
                }
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
                      navigate(
                        "/admin/dor/applications/" +
                          formId +
                          "/" +
                          row.original.reviewer.id,
                      );
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
            disabled={(pagination.pageIndex + 1) * rowCount >= reviewers.length}
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
