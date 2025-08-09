import { useNavigate, useParams } from "react-router-dom";
import Section from "@/components/form/Section";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import Loading from "@/components/Loading";
import { useApplicationResponse } from "@/hooks/useApplicationResponses";
import { useReviewData, useUpdateReviewData } from "@/hooks/useReviewData";
import Spinner from "@/components/Spinner";
import { useApplicant } from "@/hooks/useApplicants";
import { ApplicantRole, ApplicationForm } from "@/types/formBuilderTypes";
import { displayApplicantRoleName } from "@/utils/display";
import { Button } from "@/components/ui/button";
import { useRubricsForFormRole } from "@/hooks/useRubrics";
import RoleRubric from "@/components/reviewer/rubric/RoleRubric";
import { useReviewScore } from "@/hooks/useReviewScore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
        {displayApplicantRoleName(role)} Application
      </h1>
    </div>
  );
}

const ApplicationPage: React.FC = () => {
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

  const { mutate: updateReviewData } = useUpdateReviewData(reviewDataId ?? "");
  const { mutate: submitReview, isPending: isSubmitting } = useUpdateReviewData(reviewDataId ?? "");

  const {
    data: rubrics,
    isPending: rubricsPending,
    error: rubricsError
  } = useRubricsForFormRole(form?.id, reviewData?.forRole)

  const {
    data: score,
    isPending: scorePending,
    error: scoreError
  } = useReviewScore(reviewData!)

  const [localNotes, setLocalNotes] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (reviewData && localNotes === null) {
      setLocalNotes(reviewData.reviewerNotes || {});
    }
  }, [reviewData, localNotes]);

  const optimisticReviewData = useMemo(() => {
    if (!reviewData) return null;
    if (localNotes === null) return reviewData;
    return {
      ...reviewData,
      reviewerNotes: localNotes,
    };
  }, [reviewData, localNotes]);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const scoreChange = useCallback((key: string, value: number) => {
    if (!reviewData || reviewData.submitted) return;

    const newScores = {
      ...reviewData.applicantScores,
      [key]: value,
    };

    updateReviewData({ applicantScores: newScores });
  }, [reviewData, updateReviewData]);

  const commentChange = useCallback((id: string, value: string) => {
    if (localNotes === null || reviewData?.submitted) return;

    const newLocalNotes = { ...localNotes, [id]: value };
    setLocalNotes(newLocalNotes);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      updateReviewData({ reviewerNotes: newLocalNotes });
    }, 1000);
  }, [localNotes, reviewData, updateReviewData]);

  const handleSubmitReview = () => {
    submitReview({ submitted: true }, {
      onSuccess: () => {
        throwSuccessToast("Review submitted successfully!");
        navigate(-1);
      },
      onError: () => {
        throwErrorToast("Failed to submit review");
      }
    });
  }

  if (formLoading || responseLoading || reviewPending || rubricsPending || localNotes === null) return <Loading />;
  if (formError || !form)
    return <p>Failed to fetch form: {formError.message}</p>;
  if (responseError || !response)
    return <p>Failed to fetch response: {responseError?.message}</p>;
  if (reviewError || !reviewData || !optimisticReviewData)
    return <p>Failed to fetch response: {reviewError.message}</p>;
  if (rubricsError)
    return <p>Failed to fetch response: {rubricsError.message}</p>;


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] px-8">
      <div className="flex flex-row w-full py-2 px-4 items-center rounded border border-blue-300 bg-blue-100 text-blue">
        <UserHeader
          applicantId={response.userId}
          form={form}
          role={reviewData.forRole}
        />

        {
          scorePending ? <Spinner className="mr-4" /> :
            scoreError ? `Failed to calculate score: ${scoreError.message}` :
              <h1 className="text-lg text-blue w-64">Review Score: <span className="font-bold">{score.toFixed(2) ?? "N/A"}</span>/4</h1>
        }
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default" disabled={isSubmitting || optimisticReviewData.submitted}>
              {isSubmitting ? "Submitting..." : optimisticReviewData.submitted ? "Submitted" : "Submit Review"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to submit this review?</AlertDialogTitle>
              <AlertDialogDescription>
                You will not be able to edit it after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitReview}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex gap-2 justify-center grow overflow-scroll pt-4">
        <div className="w-1/2 flex h-full flex-col gap-2 overflow-scroll">
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
                    )!.questions
                  }
                  onChangeResponse={() => { }}
                />
              </div>
            ))}
        </div>
        <div className="w-1/2 overflow-y-scroll flex flex-col gap-2">
          {rubrics.sort((a, b) => a.roles.length - b.roles.length).map(r => (
            <RoleRubric key={r.id} rubric={r} onScoreChange={scoreChange} onCommentChange={commentChange} reviewData={optimisticReviewData} disabled={optimisticReviewData.submitted} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
