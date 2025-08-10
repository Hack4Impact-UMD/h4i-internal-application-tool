import { useNavigate, useParams } from "react-router-dom";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import Loading from "@/components/Loading";
import { useApplicationResponse } from "@/hooks/useApplicationResponses";
import Spinner from "@/components/Spinner";
import { useApplicant } from "@/hooks/useApplicants";
import { ApplicantRole, ApplicationForm } from "@/types/formBuilderTypes";
import { displayApplicantRoleName } from "@/utils/display";
import { Button } from "@/components/ui/button";
import { useRubricsForFormRole } from "@/hooks/useRubrics";
import RoleRubric from "@/components/reviewer/rubric/RoleRubric";
import { useCallback, useEffect, useMemo, useState } from "react";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import {
  AlertDialog,
  AlertDialogAction,    
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { useInterviewData, useUpdateInterviewData } from "@/hooks/useInterviewData";

type UserHeaderProps = {
  applicantId: string;
  form: ApplicationForm;
  role: ApplicantRole;
};

function UserHeader({ applicantId, form, role }: UserHeaderProps) {
  const { data: applicant, isPending, error } = useApplicant(applicantId);

  if (isPending)
    return (
      <div className="w-full flex flex-row items-center justify-center p-2">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="w-full bg-red-200 rounded p-2">
        <p className="text-destructive font-bold">
          Failed to fetch user: {error.message}
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-2">
      <h1 className="text-xl">
        {applicant.firstName} {applicant.lastName}'s {form.semester}{" "}
        {displayApplicantRoleName(role)} Interview
      </h1>
    </div>
  );
}

// TODO figure out what we're doing for rubrics here; unsure how many scores there are
// this was refactored for there being only one interview score but this seems to be wrong
const InterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { formId, responseId, interviewDataId } = useParams<{
    formId: string;
    interviewDataId: string;
    responseId: string;
  }>();

  const {
    data: response,
    isPending: responseLoading,
    error: responseError,
  } = useApplicationResponse(responseId);

  const {
    data: form,
    isPending: formLoading,
    error: formError,
  } = useApplicationForm(formId);

  const {
    data: interviewData,
    isPending: interviewPending,
    error: interviewError,
  } = useInterviewData(interviewDataId ?? "");

  const { mutate: updateInterviewData } = useUpdateInterviewData(interviewDataId ?? "");
  const { mutate: submitInterview, isPending: isSubmitting } = useUpdateInterviewData(
    interviewDataId ?? "",
  );

  const {
    data: rubrics,
    isPending: rubricsPending,
    error: rubricsError,
  } = useRubricsForFormRole(form?.id, interviewData?.forRole);

  const [localNotes, setLocalNotes] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (interviewData && !localNotes) {
      setLocalNotes(interviewData.interviewNotes || "");
    }
  }, [interviewData, localNotes]);

  useEffect(() => {
    const ref = setTimeout(
      () =>
        updateInterviewData({
          interviewNotes: localNotes,
        }),
      1000,
    );
    return () => {
      clearTimeout(ref);
    };
  }, [localNotes, updateInterviewData]);

  const optimisticInterviewData = useMemo(() => {
    if (!interviewData) return undefined;
    if (!localNotes) return interviewData;
    return {
      ...interviewData,
      reviewerNotes: localNotes,
    };
  }, [interviewData, localNotes]);

  const sortedRubrics = useMemo(
    () =>
      rubrics
        ? [...rubrics].sort((a, b) => a.roles.length - b.roles.length)
        : [],
    [rubrics],
  );

  const scoreChange = useCallback(
    (newScore: number) => {
      if (!interviewData || interviewData.submitted) return;
      updateInterviewData({ interviewScore: newScore });
    },
    [interviewData, updateInterviewData],
  );

  const commentChange = useCallback(
    (newLocalNotes: string) => {
      setLocalNotes(newLocalNotes);
    },
    [localNotes],
  );

  const handleSubmitInterview = () => {
    // TODO: refactor this only one question
    const requiredKeys =
      rubrics?.flatMap((r) => r.rubricQuestions.map((q) => q.scoreKey)) ?? [];
    const existingKeys = new Set(
      Object.keys(reviewData?.applicantScores ?? {}),
    );

    for (const req of requiredKeys) {
      if (!existingKeys.has(req)) {
        throwErrorToast(`Review is incomplete, missing required key ${req}`);
        return;
      }
    }

    submitInterview(
      { submitted: true },
      {
        onSuccess: () => {
          throwSuccessToast("Interview submitted successfully!");
          navigate(-1);
        },
        onError: () => {
          throwErrorToast("Failed to submit interview");
        },
      },
    );
  };

  if (
    formLoading ||
    responseLoading ||
    interviewPending ||
    rubricsPending ||
    !localNotes
  )
    return <Loading />;
  if (formError || !form)
    return <p>Failed to fetch form: {formError.message}</p>;
  if (responseError || !response)
    return <p>Failed to fetch response: {responseError?.message}</p>;
  if (interviewError) return <p>Failed to fetch interview: {interviewError.message}</p>;
  if (rubricsError)
    return <p>Failed to fetch rubrics: {rubricsError.message}</p>;
  if (!optimisticInterviewData) return <p>Failed to fetch interview data</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] px-8">
      <div className="flex flex-row w-full py-2 px-4 items-center rounded border border-blue-300 bg-blue-100 text-blue">
        <UserHeader
          applicantId={response.userId}
          form={form}
          role={interviewData.forRole}
        />

        <h1 className="text-lg text-blue w-64">
            Interview Score:{" "}
            <span className="font-bold">{optimisticInterviewData.interviewScore ?? "N/A"}</span>/4
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              disabled={isSubmitting || optimisticInterviewData.submitted}
            >
              {isSubmitting
                ? "Submitting..."
                : optimisticInterviewData.submitted
                  ? "Submitted"
                  : "Submit Interview"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to submit this interview?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will not be able to edit it after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitInterview}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex gap-2 justify-center grow overflow-scroll pt-2">
        <div className="w-1/2 overflow-y-scroll flex flex-col gap-2">
          {sortedRubrics.map((r) => (
            <RoleRubric
              key={r.id}
              rubric={r}
              onScoreChange={scoreChange}
              onCommentChange={commentChange}
              reviewData={interviewData}
              disabled={optimisticInterviewData.submitted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
