import { getAllUsers, getUserById } from "@/services/userService";
import { UserProfile } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery<UserProfile[]>({
    queryKey: ["users", "all"],
    queryFn: () => getAllUsers(),
  });
}

export function useUser(id: string) {
  return useQuery<UserProfile>({
    queryKey: ["users", "id", id],
    queryFn: () => getUserById(id),
  });
}
