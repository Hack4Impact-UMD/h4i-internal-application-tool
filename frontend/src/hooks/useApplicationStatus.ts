import { ApplicantRole } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getApplicationStatus } from "@/services/statusService";

export function useMyApplicationStatus(
  responseId: string,
  role: ApplicantRole,
) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["status", token, responseId, role],
    enabled: !!token,
    queryFn: () => getApplicationStatus(token!, responseId, role),
  });
}
