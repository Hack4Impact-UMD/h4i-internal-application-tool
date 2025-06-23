import { getAllUsers } from "@/services/userService";
import { UserProfile } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery<UserProfile[]>({
    queryKey: ["users", "all"],
    queryFn: () => getAllUsers(),
  });
}
