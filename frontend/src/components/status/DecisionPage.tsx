import { useAuth } from "@/hooks/useAuth";
import { ApplicantRole, ReviewStatus } from "@/types/types";
import { useParams } from "react-router-dom";
import { useMyApplicationStatus } from "@/hooks/useApplicationStatus";
import { displayApplicantRoleName } from "@/utils/display";
import FormMarkdown from "../form/FormMarkdown";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { useApplicationFormForResponseId } from "@/hooks/useApplicationForm";
import ConfettiExplosion from 'react-confetti-explosion';
import Loading from "../Loading";

const allowedStatuses: Set<string> = new Set([
  ReviewStatus.Accepted,
  ReviewStatus.Denied,
  ReviewStatus.Waitlisted
]);

function DecisionPage() {
  const { user } = useAuth();
  const { responseId, role } = useParams();

  if (!user || !responseId || !role) return <ErrorPage />;

  const {
    data: appStatus,
    isPending: statusPending,
    error: statusError,
  } = useMyApplicationStatus(responseId, role as ApplicantRole);

  const {
    data: form,
    isPending: formPending,
    error: formError,
  } = useApplicationFormForResponseId(responseId);

  if (statusPending || formPending) {
    return <Loading />
  }

  if (statusError || formError) {
    return <ErrorPage />
  }

  if (!appStatus.released || !allowedStatuses.has(appStatus.status)) {
    return <NotFoundPage />
  }

  const decisionLetterText = 
    appStatus.status === ReviewStatus.Accepted
      ? form.decisionLetter?.[ReviewStatus.Accepted][
          appStatus.role === ApplicantRole.Bootcamp ? appStatus.role : "team"
        ]
    : appStatus.status === ReviewStatus.Waitlisted 
      ? form.decisionLetter?.[ReviewStatus.Waitlisted][
        appStatus.role === ApplicantRole.Bootcamp ? appStatus.role : "team"
        ]
    : form.decisionLetter?.[ReviewStatus.Denied];

  return (
    <>
      <div className="mt-5 mx-auto max-w-5xl w-full px-5 py-5 font-sans leading-relaxed">
        <div className="flex gap-2 flex-col sm:flex-row items-start justify-between mb-5">
          <div className="flex flex-col">
            <h2 className="text-blue text-2xl">
              Your Hack4Impact-UMD<br></br>
              {displayApplicantRoleName(role as ApplicantRole)} Application
            </h2>
          </div>
        </div>
        <div className="font-[Karla] text-sm font-normal leading-tight text-justify [text-justify:inter-word]">
          <p>
            Dear {user.firstName} {user.lastName},
          </p>
          <br></br>
          {appStatus.status === ReviewStatus.Accepted && 
            <ConfettiExplosion 
              className="justify-self-center self-start"
              force={0.8}
              duration={3000}
              particleCount={250}
              width={1600}
            />
          }
          <FormMarkdown>{decisionLetterText}</FormMarkdown>
        </div>
      </div>
    </>
  );
}

export default DecisionPage;
