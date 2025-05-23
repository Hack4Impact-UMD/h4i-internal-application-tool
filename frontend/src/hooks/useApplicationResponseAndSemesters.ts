import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getApplicationResponseAndSemester } from "../services/applicationResponseAndSemesterService";
import { ApplicationResponse } from "../types/types";

export type ApplicationResponseWithSemester = ApplicationResponse & {
  semester: string;
};

export function useApplicationResponsesAndSemesters() {
  const { user, isAuthed, isLoading } = useAuth()

  return useQuery<ApplicationResponseWithSemester[]>({
    queryKey: ["responses-and-semester", user?.id],
    enabled: !isLoading && isAuthed,
    queryFn: () => {
      return getApplicationResponseAndSemester(user!.id)
    },
    initialData: []
  })
}
