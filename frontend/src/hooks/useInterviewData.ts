import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { getInterviewDataById, getInterviewDataForForm, updateInterviewData } from "@/services/interviewDataService";
import { ApplicationInterviewData } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInterviewData(interviewDataId: string) {
  return useQuery<ApplicationInterviewData>({
    queryKey: ["interview-data", "id", interviewDataId],
    enabled: !!interviewDataId,
    queryFn: () => getInterviewDataById(interviewDataId),
  });
}

export function useUpdateInterviewData(interviewDataId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: Partial<Omit<ApplicationInterviewData, "id">>) => {
      await updateInterviewData(interviewDataId, update);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["interview-data", "id", interviewDataId],
      });
      const previousData = queryClient.getQueryData<ApplicationInterviewData>([
        "interview-data",
        "id",
        interviewDataId,
      ]);
      queryClient.setQueryData<ApplicationInterviewData>(
        ["interview-data", "id", interviewDataId],
        (old) => {
          if (!old) return undefined;
          return {
            ...old,
            ...newData,
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(
        ["interview-data", "id", interviewDataId],
        context?.previousData,
      );
      throwErrorToast("Failed to update interview!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["interview-data", "id", interviewDataId],
      });
      queryClient.invalidateQueries({
        queryKey: ["score", "interview", interviewDataId],
      });
    },
  });
}

export function useInterviewDataForForm(formId: string) {
  return useQuery<ApplicationInterviewData[]>({
    queryKey: ["interview-data", "form", formId],
    enabled: !!formId,
    queryFn: () => getInterviewDataForForm(formId),
  });
}
