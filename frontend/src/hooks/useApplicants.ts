import { useQuery } from "@tanstack/react-query";
import { getAllApplicants, UserProfile } from "../services/userService";

export function useApplicants() {
  return useQuery<UserProfile[]>({
    queryKey: ["applicants"],
    queryFn: getAllApplicants
  })
}
