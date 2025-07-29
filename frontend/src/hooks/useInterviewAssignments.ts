import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { InterviewAssignment } from "@/types/types";
import {
  getInterviewAssignments,
  getInterviewAssignmentsForForm,
} from "@/services/interviewAssignmentService";

export function useInterviewAssignmentsForForm(formId: string) {
  return useQuery<InterviewAssignment[]>({
    queryKey: ["interview-assignments", "form", formId],
    queryFn: () => getInterviewAssignmentsForForm(formId),
  });
}

export function useMyInterviewAssignments(formId: string) {
  const { user } = useAuth();

  return useQuery<InterviewAssignment[]>({
    queryKey: ["interview-assignments", "me", formId],
    enabled: !!user,
    queryFn: () => getInterviewAssignments(formId, user!.id),
  });
}
