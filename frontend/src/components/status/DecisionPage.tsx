import { useAuth } from "@/hooks/useAuth";
import {
  ApplicantRole,
  ReviewStatus,
  DecisionLetterStatus,
} from "@/types/types";
import { useParams } from "react-router-dom";
import { useMyApplicationStatus } from "@/hooks/useApplicationStatus";
import { displayApplicantRoleName } from "@/utils/display";
import FormMarkdown from "../form/FormMarkdown";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { useApplicationFormForResponseId } from "@/hooks/useApplicationForm";
import ConfettiExplosion from "react-confetti-explosion";
import Loading from "../Loading";
import { createDecisionConfirmation } from "@/services/decisionConfirmationService";
import { throwSuccessToast } from "../toasts/SuccessToast";
import { throwErrorToast } from "../toasts/ErrorToast";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";

const allowedStatuses: Set<string> = new Set([
  ReviewStatus.Accepted,
  ReviewStatus.Denied,
  ReviewStatus.Waitlisted,
]);

function DecisionPage() {
  const { user, token } = useAuth();
  const { responseId, role } = useParams<{
    responseId: string;
    role: ApplicantRole;
  }>();

  const {
    data: appStatus,
    isPending: statusPending,
    error: statusError,
  } = useMyApplicationStatus(responseId, role);

  const {
    data: form,
    isPending: formPending,
    error: formError,
  } = useApplicationFormForResponseId(responseId);

  if (!user || !responseId || !role) return <ErrorPage />;

  if (statusPending || formPending) {
    return <Loading />;
  }

  if (statusError || formError) {
    return <ErrorPage />;
  }

  if (!appStatus.released || !allowedStatuses.has(appStatus.status)) {
    return <NotFoundPage />;
  }

  const confirmDecisionMutation = useMutation({
    mutationFn: async (status: "accepted" | "denied") => {
      const decisionLetterStatus: DecisionLetterStatus = {
        status,
        userId: user?.id,
        formId: form?.id,
        responseId,
        internalStatusId: appStatus.id,
      };

      return createDecisionConfirmation(
        decisionLetterStatus,
        (await token()) ?? "",
      );
    },
    onSuccess: (_, status) => {
      throwSuccessToast(
        status === "accepted"
          ? "Decision to join confirmed!"
          : "Decision to not join confirmed.",
      );
    },
    onError: (error) => {
      console.log(error);
      throwErrorToast("Error while registering decision: " + error);
    },
  });

  const roleKey = appStatus.role === ApplicantRole.Bootcamp ? ApplicantRole.Bootcamp : "team";

  const decisionLetterText =
    appStatus.status === ReviewStatus.Accepted ||
    appStatus.status === ReviewStatus.Waitlisted
      ? form?.decisionLetter?.[appStatus.status]?.[roleKey]
      : form?.decisionLetter?.[ReviewStatus.Denied];

  if (!decisionLetterText) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="mt-5 mx-auto max-w-5xl w-full px-5 py-5 font-sans leading-relaxed">
        <div className="flex gap-2 flex-col sm:flex-row items-start justify-between mb-5">
          <div className="flex flex-col">
            <h2 className="text-blue text-2xl">
              Your Hack4Impact-UMD {form.semester}
              <br></br>
              {displayApplicantRoleName(role as ApplicantRole)} Application
            </h2>
          </div>
        </div>
        <div className="font-[Karla] text-sm font-normal leading-tight text-justify [text-justify:inter-word]">
          <p>
            Dear {user.firstName} {user.lastName},
          </p>
          <br></br>
          {appStatus.status === ReviewStatus.Accepted && (
            <ConfettiExplosion
              className="justify-self-center self-start"
              force={0.8}
              duration={3000}
              particleCount={250}
              width={1600}
            />
          )}
          <FormMarkdown>{decisionLetterText}</FormMarkdown>
        </div>
        {form.isActive && appStatus.status === ReviewStatus.Accepted && (
          <div className="flex justify-end mt-10 gap-3">
            <Button onClick={() => confirmDecisionMutation.mutate("denied")}>
              Deny
            </Button>
            <Button onClick={() => confirmDecisionMutation.mutate("accepted")}>
              Accept
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default DecisionPage;
