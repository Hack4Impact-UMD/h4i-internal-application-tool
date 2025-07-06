import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getApplicationResponseAndSemester } from "../services/applicationResponseAndSemesterService";

export function useApplicationResponsesAndSemesters() {
  const { user, isAuthed, isLoading } = useAuth();

  return useQuery({
    queryKey: ["responses-and-semester", user?.id],
    enabled: !isLoading && isAuthed,
    queryFn: () => {
      return getApplicationResponseAndSemester(user!.id);
    },
    initialData: [],
  });
}
