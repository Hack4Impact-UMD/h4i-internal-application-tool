import { useNavigate, useParams } from "react-router-dom";
import Section from "@/components/form/Section";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import Loading from "@/components/Loading";
import { useApplicationResponse } from "@/hooks/useApplicationResponses";
import { useReviewData, useUpdateReviewData } from "@/hooks/useReviewData";
import Spinner from "@/components/Spinner";
import { useApplicant } from "@/hooks/useApplicants";
import { ApplicantRole, ApplicationForm } from "@/types/formBuilderTypes";
import { displayApplicantRoleNameNoEmoji } from "@/utils/display";
import { Button } from "@/components/ui/button";
import { useRubricsForFormRole } from "@/hooks/useRubrics";
import RoleRubric from "@/components/reviewer/rubric/RoleRubric";
import { useReviewScore } from "@/hooks/useReviewScore";
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ApplicationReviewData, PermissionRole } from "@/types/types";
import { CheckIcon, CircleAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUsers";

type UserHeaderProps = {
  applicantId: string;
  form: ApplicationForm;
  role: ApplicantRole;
  lastSave?: number;
  reviewData: ApplicationReviewData;
};

function UserHeader({
  applicantId,
  form,
  role,
  lastSave,
  reviewData,
}: UserHeaderProps) {
  const { data: applicant, isPending, error } = useApplicant(applicantId);
  const { user } = useAuth();
  const {
    data: reviewer,
    isPending: reviewerPending,
    error: reviewerError,
  } = useUser(reviewData.reviewerId);

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
    <div className="w-full flex flex-col gap-0">
      <h1 className="text-xl">
        {applicant.firstName} {applicant.lastName}'s {form.semester}{" "}
        {displayApplicantRoleNameNoEmoji(role)} Application
      </h1>
      <span>
        {reviewData.submitted ? (
          <span>
            <CheckIcon className="inline size-5" /> Submitted{" "}
            {user?.role === PermissionRole.SuperReviewer ? (
              reviewerPending ? (
                <p>by ...</p>
              ) : reviewerError ? (
                <p>by (failed to load reviewer) </p>
              ) : (
                <>
                  by{" "}
                  <strong>
                    {reviewer.firstName} {reviewer.lastName}
                  </strong>
                </>
              )
            ) : (
              <></>
            )}
          </span>
        ) : lastSave ? (
          `Last saved ${new Date(lastSave).toLocaleTimeString()}`
        ) : (
          `Not saved`
        )}
      </span>
    </div>
  );
}

const AppReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { formId, responseId, reviewDataId } = useParams<{
    formId: string;
    reviewDataId: string;
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
    data: reviewData,
    isPending: reviewPending,
    error: reviewError,
  } = useReviewData(reviewDataId ?? "");

  const { mutate: updateReviewData, submittedAt: lastSave } =
    useUpdateReviewData(reviewDataId ?? "");
  const { mutate: submitReview, isPending: isSubmitting } = useUpdateReviewData(
    reviewDataId ?? "",
  );

  const {
    data: rubrics,
    isPending: rubricsPending,
    error: rubricsError,
  } = useRubricsForFormRole(form?.id, reviewData?.forRole);

  const {
    data: score,
    isFetching: scorePending,
    error: scoreError,
  } = useReviewScore(reviewData!);

  const [localNotes, setLocalNotes] = useState<
    Record<string, string> | undefined
  >(undefined);

  useEffect(() => {
    if (reviewData && !localNotes) {
      setLocalNotes(reviewData.reviewerNotes || {});
    }
  }, [reviewData, localNotes]);

  useEffect(() => {
    if (localNotes === undefined || !reviewData || reviewData.submitted) return;
    const ref = setTimeout(() => {
      updateReviewData(
        { reviewerNotes: localNotes },
        {
          onError: (err) => {
            console.log("Autosave failed:", err);
            throwErrorToast("Failed to autosave notes!");
          },
        },
      );
    }, 1000);
    return () => clearTimeout(ref);
  }, [localNotes, reviewData, updateReviewData]);

  const optimisticReviewData = useMemo(() => {
    if (!reviewData) return undefined;
    if (!localNotes) return reviewData;
    return {
      ...reviewData,
      reviewerNotes: localNotes,
    };
  }, [reviewData, localNotes]);

  const sortedRubrics = useMemo(
    () =>
      rubrics
        ? [...rubrics].sort((a, b) => a.roles.length - b.roles.length)
        : [],
    [rubrics],
  );

  const scoreChange = useCallback(
    (key: string, value: number) => {
      if (!reviewData || reviewData.submitted) return;

      const newScores = {
        ...reviewData.applicantScores,
        [key]: value,
      };

      updateReviewData({ applicantScores: newScores });
    },
    [reviewData, updateReviewData],
  );

  const commentChange = useCallback((id: string, value: string) => {
    setLocalNotes((prev) => ({ ...(prev ?? {}), [id]: value }));
  }, []);

  const handleSubmitReview = () => {
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

    submitReview(
      {
        ...optimisticReviewData,
        reviewerNotes: localNotes,
        submitted: true,
      },
      {
        onSuccess: () => {
          throwSuccessToast("Review submitted successfully!");
          navigate(-1);
        },
        onError: () => {
          throwErrorToast("Failed to submit review");
        },
      },
    );
  };

  if (
    formLoading ||
    responseLoading ||
    reviewPending ||
    rubricsPending ||
    !localNotes
  )
    return <Loading />;
  if (formError || !form)
    return <p>Failed to fetch form: {formError.message}</p>;
  if (responseError || !response)
    return <p>Failed to fetch response: {responseError?.message}</p>;
  if (reviewError) return <p>Failed to fetch review: {reviewError.message}</p>;
  if (rubricsError)
    return <p>Failed to fetch rubrics: {rubricsError.message}</p>;
  if (!optimisticReviewData) return <p>Failed to fetch review data</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] px-8">
      <div className="flex flex-row w-full py-2 px-4 items-center rounded border border-blue-300 bg-blue-100 text-blue">
        <UserHeader
          reviewData={reviewData}
          applicantId={response.userId}
          form={form}
          role={reviewData.forRole}
          lastSave={lastSave}
        />

        {scorePending ? (
          <Spinner className="mr-4" />
        ) : scoreError ? (
          `Failed to calculate score: ${scoreError.message}`
        ) : (
          <span className="text-lg text-blue w-64 mr-2">
            Review Score:{" "}
            {typeof score === "number" ? (
              <>
                <span className="font-bold">{score.toFixed(2) ?? "N/A"}</span> /
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
              disabled={isSubmitting || optimisticReviewData.submitted}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : optimisticReviewData.submitted ? (
                <span>
                  <CheckIcon className="inline" /> Submitted
                </span>
              ) : (
                "Submit Review"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to submit this review?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will not be able to edit it after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitReview}>
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
            {sortedRubrics.map((r) => (
              <RoleRubric
                role={reviewData.forRole}
                key={r.id}
                rubric={r}
                onScoreChange={scoreChange}
                onCommentChange={commentChange}
                reviewData={optimisticReviewData}
                disabled={optimisticReviewData.submitted}
                form={form}
              />
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AppReviewPage;
