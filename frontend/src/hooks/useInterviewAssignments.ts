import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { InterviewAssignment } from "@/types/types";
import { getInterviewAssignments } from "@/services/interviewAssignmentService";

export function useMyInterviewAssignments(formId: string) {
  const { user } = useAuth();

  return useQuery<InterviewAssignment[]>({
    queryKey: ["interview", "assignments", "me", formId],
    enabled: !!user,
    queryFn: () => getInterviewAssignments(formId, user!.id),
  });
}
