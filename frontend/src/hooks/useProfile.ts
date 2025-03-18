import { useQuery } from "@tanstack/react-query";
import { getUserById, UserProfile } from "../services/userService";

export function useProfile(uid: string) {
  return useQuery<UserProfile>({
    queryKey: ["profile", uid],
    queryFn: async () => {
      return await getUserById(uid)
    }
  })
}
