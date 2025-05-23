import { useQuery } from "@tanstack/react-query";
import { getAllApplicants } from "../services/applicantService.ts";
import { ApplicantUserProfile } from "../types/types";

export function useApplicants() {
  return useQuery<ApplicantUserProfile[]>({
    queryKey: ["applicants"],
    queryFn: getAllApplicants
  })
}

