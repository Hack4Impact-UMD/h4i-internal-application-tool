import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { InterviewAssignment } from "@/types/types";
import {
  getInterviewAssignments,
  getInterviewAssignmentsForApplication,
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

export function useInterviewAssignmentsForResponse(responseId: string) {
  return useQuery<InterviewAssignment[]>({
    queryKey: ["interview-assignments", "response", responseId],
    enabled: !!responseId,
    queryFn: () => getInterviewAssignmentsForApplication(responseId),
  });
}
