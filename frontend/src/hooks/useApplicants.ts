import { useQuery } from "@tanstack/react-query";
import { getAllApplicants } from "../services/userService";
import { UserProfile } from "../types/types";

export function useApplicants() {
  return useQuery<UserProfile[]>({
    queryKey: ["applicants"],
    queryFn: getAllApplicants
  })
}
