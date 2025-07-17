import { ApplicantRole, PermissionRole, UserProfile } from "@/types/types";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { DataTable } from "../DataTable";
import { Checkbox } from "../ui/checkbox";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { displayApplicantRoleName, displayUserRoleName } from "@/utils/display";
import { throwErrorToast } from "../toasts/ErrorToast";
import { Timestamp } from "firebase/firestore";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type UserTableProps = {
  users: UserProfile[];
  setUserRoles: (users: UserProfile[], role: PermissionRole) => void;
  deleteUsers: (users: UserProfile[]) => void;
};

export default function UserTable({
  users,
  setUserRoles,
  deleteUsers,
}: UserTableProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [toUpdate, setToUpdate] = useState<UserProfile[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [action, setAction] = useState<"delete" | "role">();

  function DeleteDialog() {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Confirm User Deletion</DialogTitle>
          <DialogDescription>
            <span className="text-destructive font-bold">
              This action cannot be undone!
            </span>{" "}
            The following users will be permanently deleted:
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 max-h-32 overflow-y-scroll">
          <ul className="list-disc list-inside">
            {toUpdate.map((u) => (
              <li key={u.id}>
                {u.firstName} {u.lastName} ({u.email})
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="sm:justify-start flex">
          <DialogClose asChild className="grow">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteUsers(toUpdate)}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

  function RoleDialog() {
    const [role, setRole] = useState<PermissionRole>(PermissionRole.Applicant);

    return (
      <>
        <DialogHeader>
          <DialogTitle>Update Roles</DialogTitle>
          <DialogDescription>
            Select the role to assign the following users:
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 max-h-32 overflow-y-scroll">
          <ul className="list-disc list-inside">
            {toUpdate.map((u) => (
              <li key={u.id}>
                {u.firstName} {u.lastName} ({u.email})
              </li>
            ))}
          </ul>
        </div>
        <select
          value={role}
          className="bg-lightgray p-2 rounded-sm"
          onChange={(e) => setRole(e.target.value as PermissionRole)}
        >
          {Object.entries(PermissionRole).map((e) => (
            <option key={e[1]} value={e[1]}>
              {displayUserRoleName(e[1])}
            </option>
          ))}
        </select>
        <DialogFooter className="sm:justify-start flex">
          <DialogClose asChild className="grow">
            <Button
              type="button"
              variant="default"
              onClick={() => setUserRoles(toUpdate, role)}
            >
              Update
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

  function WhitelistDialog() {
    const [input, setInput] = useState("");

    function handleUpdate() {
      const emails = input
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e.length != 0);
      const usersToUpdate = emails
        .map((email) => users.find((u) => u.email == email))
        .filter((u) => u != undefined);

      console.log("Setting the following users to REVIEWER: ", usersToUpdate);

      if (usersToUpdate.length == 0) {
        throwErrorToast("The emails you entered don't match any users");
      } else if (usersToUpdate.length != emails.length) {
        throwErrorToast(
          `Some emails did not match existing users. Inputted ${emails.length} emails, but found ${usersToUpdate.length} corresponding users!`,
        );
        setUserRoles(usersToUpdate, PermissionRole.Reviewer);
      } else {
        setUserRoles(usersToUpdate, PermissionRole.Reviewer);
      }
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>Whitelist Reviewers</DialogTitle>
          <DialogDescription>
            Paste a list of emails to assign the reviewer role to the
            corresponding users. Emails should be separated by a new line. The
            whitelist will only apply to currently registered users.{" "}
            <span className="font-bold">
              Users that register after the whitelist is applied will need to be
              whitelisted again or manually assigned the reviewer role.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 max-h-32 overflow-y-scroll">
          <textarea
            className="w-full min-h-32 border rounded-sm p-1 text-sm bg-lightgray"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
        <DialogFooter className="sm:justify-start flex">
          <DialogClose asChild className="grow">
            <Button type="button" variant="default" onClick={handleUpdate}>
              Update
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

  const columns: ColumnDef<UserProfile>[] = useMemo(
    () => [
      {
        id: "select",
        cell: ({ row }) => {
          return (
            <div>
              <Checkbox
                className="size-4"
                checked={row.getIsSelected()}
                onClick={() => row.toggleSelected()}
              />
            </div>
          );
        },
        header: ({ table }) => {
          return (
            <div>
              <Checkbox
                checked={table.getIsAllRowsSelected()}
                onClick={() => table.toggleAllRowsSelected()}
              />
            </div>
          );
        },
      },
      {
        id: "Name",
        accessorFn: (profile) => `${profile.firstName} ${profile.lastName}`,
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
                NAME
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
      },
      {
        accessorKey: "id",
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
                USER ID
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
      },
      {
        accessorKey: "email",
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
                EMAIL
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
      },
      {
        accessorKey: "dateCreated",
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
                DATE CREATED
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
        cell: ({ row }) => {
          const ts = row.getValue("dateCreated") as Timestamp;
          return (
            <span>
              {ts.toDate().toLocaleDateString() +
                " " +
                ts.toDate().toLocaleTimeString()}
            </span>
          );
        },
      },
      {
        id: "revRole",
        header: () => <span>Rev. Role</span>,
        cell: ({ row }) => {
          const roles = (row.getValue("revRole") as ApplicantRole[]) ?? [];
          return (
            <div className="flex flex-row gap-1">
              {roles.map((r) => (
                <span className="rounded-full p-2 bg-amber-200">
                  {displayApplicantRoleName(r)}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "role",
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
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          return (
            <select
              value={role}
              onChange={(e) =>
                setUserRoles([row.original], e.target.value as PermissionRole)
              }
            >
              {Object.entries(PermissionRole).map((e) => (
                <option value={e[1]} key={e[1]}>
                  {displayUserRoleName(e[1] as PermissionRole)}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        id: "delete",
        cell: ({ row }) => {
          return (
            <DialogTrigger
              className="cursor-pointer border rounded-sm p-2"
              onClick={() => setToUpdate([row.original])}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 stroke-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </DialogTrigger>
          );
        },
      },
    ],
    [setUserRoles],
  );

  const selectedUsers = useMemo(
    () =>
      Object.keys(selectedRows)
        .filter((k) => selectedRows[k])
        .map((i) => users[parseInt(i)]),
    [selectedRows, users],
  );

  return (
    <div>
      <div className="flex flex-row gap-2 mb-2">
        <div className="grow">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="min-h-5 px-2 py-1 border-gray-400 border rounded-sm"
            placeholder="Search"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Whitelist Reviewers</Button>
          </DialogTrigger>
          <DialogContent>
            <WhitelistDialog />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Bulk Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Apply to selected users</DropdownMenuLabel>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DialogTrigger
                className="cursor-pointer"
                disabled={selectedUsers.length == 0}
                asChild
                onClick={() => {
                  setToUpdate(selectedUsers);
                  setAction("role");
                }}
              >
                <DropdownMenuItem>
                  <span>Change roles...</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger
                className="cursor-pointer text-destructive"
                disabled={selectedUsers.length == 0}
                asChild
                onClick={() => {
                  setToUpdate(selectedUsers);
                  setAction("delete");
                }}
              >
                <DropdownMenuItem>
                  <span>Delete selected</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-md">
            {action == "delete" ? <DeleteDialog /> : <RoleDialog />}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog>
        <DataTable
          options={{
            onRowSelectionChange: setSelectedRows,
            state: {
              globalFilter: searchFilter,
              rowSelection: selectedRows,
            },
          }}
          data={users}
          columns={columns}
        ></DataTable>

        <DialogContent className="sm:max-w-md">
          <DeleteDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
}
