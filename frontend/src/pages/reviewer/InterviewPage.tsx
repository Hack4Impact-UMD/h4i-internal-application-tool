import { useNavigate, useParams } from "react-router-dom";
import Section from "@/components/form/Section";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import Loading from "@/components/Loading";
import { useApplicationResponse } from "@/hooks/useApplicationResponses";
import Spinner from "@/components/Spinner";
import { useApplicant } from "@/hooks/useApplicants";
import { ApplicantRole, ApplicationForm } from "@/types/formBuilderTypes";
import { displayApplicantRoleName } from "@/utils/display";
import { Button } from "@/components/ui/button";
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
import { useInterviewRubricsForFormRole } from "@/hooks/useInterviewRubrics";
import { useInterviewScore } from "@/hooks/useInterviewScore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleAlertIcon } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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
    data: interviewRubrics,
    isPending: interviewRubricsPending,
    error: interviewRubricsError,
  } = useInterviewRubricsForFormRole(form?.id, interviewData?.forRole);

  const {
    data: interviewScore,
    isPending: interviewScorePending,
    error: interviewScoreError,
  } = useInterviewScore(interviewData!);

  const [localNotes, setLocalNotes] = useState<
    Record<string, string> | undefined
  >(undefined);

  useEffect(() => {
    if (interviewData && !localNotes) {
      setLocalNotes(interviewData.interviewerNotes || {});
    }
  }, [interviewData, localNotes]);

  useEffect(() => {
    if (localNotes === undefined || !interviewData || interviewData.submitted) return;
    const ref = setTimeout(() => {
      updateInterviewData({ interviewerNotes: localNotes });
    }, 1000);
    return () => clearTimeout(ref);
  }, [localNotes, interviewData, updateInterviewData])

  const optimisticInterviewData = useMemo(() => {
    if (!interviewData) return undefined;
    if (!localNotes) return interviewData;
    return {
      ...interviewData,
      reviewerNotes: localNotes,
    };
  }, [interviewData, localNotes]);

  const sortedInterviewRubrics = useMemo(
    () =>
      interviewRubrics
        ? [...interviewRubrics].sort((a, b) => a.roles.length - b.roles.length)
        : [],
    [interviewRubrics],
  );

  const interviewScoreChange = useCallback(
    (key: string, value: number) => {
      if (!interviewData || interviewData.submitted) return;

      const newScores = {
        ...interviewData.interviewScores,
        [key]: value,
      };

      updateInterviewData({ interviewScores: newScores });
    },
    [interviewData, updateInterviewData],
  );

  const commentChange = useCallback((id: string, value: string) => {
    setLocalNotes((prev) => ({ ...(prev ?? {}), [id]: value }));
  }, []);

  const handleSubmitInterview = () => {
    const requiredKeys =
      interviewRubrics?.flatMap((r) => r.rubricQuestions.map((q) => q.scoreKey)) ?? [];
    const existingKeys = new Set(
      Object.keys(interviewData?.interviewScores ?? {}),
    );

    for (const req of requiredKeys) {
      if (!existingKeys.has(req)) {
        throwErrorToast(`Interview is incomplete, missing required key ${req}`);
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
    interviewRubricsPending ||
    !localNotes
  )
    return <Loading />;
  if (formError || !form)
    return <p>Failed to fetch form: {formError.message}</p>;
  if (responseError || !response)
    return <p>Failed to fetch response: {responseError?.message}</p>;
  if (interviewError) return <p>Failed to fetch interview: {interviewError.message}</p>;
  if (interviewRubricsError)
    return <p>Failed to fetch rubrics: {interviewRubricsError.message}</p>;
  if (!optimisticInterviewData) return <p>Failed to fetch interview data</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] px-8">
      <div className="flex flex-row w-full py-2 px-4 items-center rounded border border-blue-300 bg-blue-100 text-blue">
        <UserHeader
          applicantId={response.userId}
          form={form}
          role={interviewData.forRole}
        />

        {interviewScorePending ? (
          <Spinner className="mr-4" />
        ) : interviewScoreError ? (
          `Failed to calculate score: ${interviewScoreError.message}`
        ) : (
          <span className="text-lg text-blue w-66 mr-2">
            Interview Score:{" "}
            {typeof interviewScore === "number" ? (
              <>
                <span className="font-bold">{interviewScore.toFixed(2) ?? "N/A"}</span> /
                4
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleAlertIcon className="inline" />
                </TooltipTrigger>
                <TooltipContent>Score is undefined!</TooltipContent>
              </Tooltip>
            )}
          </span>
        )}
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
      <ResizablePanelGroup
        direction="horizontal"
        className="flex gap-2 justify-center grow overflow-scroll pt-2"
      >
        <ResizablePanel defaultSize={50}>
          <div className="w-full flex h-full flex-col gap-2 overflow-scroll rounded-md">
            {form.sections
              .filter((s) => {
                if (s.forRoles) {
                  return (
                    s.forRoles.filter((r) => response.rolesApplied.includes(r))
                      .length > 0
                  );
                } else {
                  return true;
                }
              })
              .map((s) => (
                <div
                  className="shadow border border-gray-200 bg-white rounded-md p-4"
                  key={s.sectionId}
                >
                  <Section
                    responseId={response.id}
                    key={s.sectionId}
                    disabled={true}
                    section={s}
                    responses={
                      response.sectionResponses.find(
                        (r) => r.sectionId == s.sectionId,
                      )?.questions ?? []
                    }
                    onChangeResponse={() => {}}
                  />
                </div>
              ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="w-full overflow-y-scroll flex flex-col gap-2 h-full rounded-md">
            {sortedInterviewRubrics.map((r) => (
              <RoleRubric
                role={interviewData.forRole}
                key={r.id}
                rubric={r}
                onScoreChange={interviewScoreChange}
                onCommentChange={commentChange}
                interviewData={optimisticInterviewData}
                disabled={optimisticInterviewData.submitted}
                form={form}
              />
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default InterviewPage;
