import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getApplicationResponses } from "../services/applicationResponsesService";
import { ApplicationResponse } from "../types/types";

export function useApplicationResponses() {
  const { user, isAuthed, isLoading } = useAuth()

  return useQuery<ApplicationResponse[]>({
    queryKey: ["responses", user?.id],
    enabled: !isLoading && isAuthed,
    queryFn: () => {
      return getApplicationResponses(user!.id)
    },
    initialData: []
  })
}
