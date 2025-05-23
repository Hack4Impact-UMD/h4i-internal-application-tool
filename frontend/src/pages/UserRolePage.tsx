import UserTable from "@/components/admin/UserTable";
import { throwErrorToast } from "@/components/error/ErrorToast";
import Loading from "@/components/Loading";
import { queryClient } from "@/config/query";
import { useUsers } from "@/hooks/useUsers";
import { deleteUsers, updateUserRoles } from "@/services/userService";
import { PermissionRole, UserProfile } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export default function UserRolePage() {
  const { data: users, isLoading, error } = useUsers();

  const roleMutation = useMutation({
    mutationFn: ({ users, role }: { users: UserProfile[], role: PermissionRole }) => {
      return updateUserRoles(users.map(u => u.id), role)
    },
    onMutate: async ({ users, role }) => {
      await queryClient.cancelQueries({ queryKey: ["users", "all"] })
      const prevUsers = queryClient.getQueryData(["users", "all"])
      const uids = users.map(u => u.id)

      queryClient.setQueryData(["users", "all"], (old: UserProfile[]) => old.map(user => {
        if (uids.includes(user.id)) {
          return {
            ...user,
            role: role
          }
        } else {
          return user
        }
      }))

      return { prevUsers }
    },
    onError: (err, update, ctx) => {
      throwErrorToast("Failed to update user roles!")
      console.error("Role update failed")
      console.error(err)
      console.error("Update:", update)
      queryClient.setQueryData(["users", "all"], ctx?.prevUsers)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (users: UserProfile[]) => {
      return deleteUsers(users.map(u => u.id))
    },
    onMutate: async (users) => {
      await queryClient.cancelQueries({ queryKey: ["users", "all"] })
      const prevUsers = queryClient.getQueryData(["users", "all"])
      const uids = users.map(u => u.id)

      queryClient.setQueryData(["users", "all"], (old: UserProfile[]) => old.filter(user => {
        if (uids.includes(user.id)) {
          return false
        } else {
          return true
        }
      }))

      return { prevUsers }
    },
    onError: (err, update, ctx) => {
      throwErrorToast("Failed to delete users!")
      console.error("Delete failed")
      console.error(err)
      console.error("Update:", update)
      queryClient.setQueryData(["users", "all"], ctx?.prevUsers)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] })
    }
  })

  if (isLoading) return <Loading />

  function handleDelete(users: UserProfile[]) {
    deleteMutation.mutate(users)
  }

  function handleRoleChange(users: UserProfile[], role: PermissionRole) {
    roleMutation.mutate({ users: users, role: role })
  }

  return <div className="p-4 w-full flex flex-col items-center">
    <div className="w-full max-w-5xl">
      <h1 className="font-bold text-xl mb-5 pt-5">Manage Users</h1>
      {error ? <p>An error occurred while loading user data: {error.message}</p>
        : <UserTable users={users ?? []} setUserRoles={handleRoleChange} deleteUsers={handleDelete}></UserTable>
      }
    </div>
  </div>
}
