import { useAuth } from "@/hooks/useAuth";
import { ApplicantRole, ReviewStatus } from "@/types/types";
import { useParams } from "react-router-dom";
import { useMyApplicationStatus } from "@/hooks/useApplicationStatus";
import { displayApplicantRoleName } from "@/utils/display";
import Spinner from "../Spinner";
import FormMarkdown from "../form/FormMarkdown";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { useApplicationFormForResponseId } from "@/hooks/useApplicationForm";

function DecisionPage() {
  const { user } = useAuth();
  const { responseId, role } = useParams();

  if (!user) return <ErrorPage />;
  if (!responseId) return <ErrorPage />;
  if (!role) return <ErrorPage />;

  const {
    data: appStatus,
    isPending: isStatusPending,
    error: statusError,
  } = useMyApplicationStatus(responseId, role as ApplicantRole);

  if (isStatusPending)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={4}>
          <Spinner className="w-full" />
        </td>
      </tr>
    );

  if (statusError)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={4}>
          <p className="text-center">{statusError.message}</p>
        </td>
      </tr>
    );

  const {
    data: form,
    isPending: formPending,
    error: formError,
  } = useApplicationFormForResponseId(responseId);

  if (formPending)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={4}>
          <Spinner className="w-full" />
        </td>
      </tr>
    );

  if (formError)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={4}>
          <p className="text-center">{formError.message}</p>
        </td>
      </tr>
    );

  if (!appStatus.released) {
    return <NotFoundPage />
  }

  if (appStatus.status !== ReviewStatus.Accepted && appStatus.status !== ReviewStatus.Denied && appStatus.status !== ReviewStatus.Waitlisted) {
    return <NotFoundPage />
  }

  const decisionLetterText = appStatus.status === ReviewStatus.Accepted
    ? form.decisionLetter?.accepted[
        appStatus.role === ApplicantRole.Bootcamp ? appStatus.role : "team"
      ]
    : form.decisionLetter?.[appStatus.status];

  return (
    <div className="mt-5 mx-auto max-w-5xl w-full px-5 py-5 font-sans leading-relaxed">
      <div className="flex gap-2 flex-col sm:flex-row items-start justify-between mb-5">
        <div className="flex flex-col">
          <h2 className="text-blue text-2xl">
            Your {displayApplicantRoleName(role as ApplicantRole).slice(2)}{" "}
            application for <br></br> Hack4Impact-UMD{" "}
          </h2>
        </div>
      </div>
      <div className="font-[Karla] text-sm font-normal leading-tight text-justify [text-justify:inter-word]">
        <p>
          Dear {user.firstName} {user.lastName},
        </p>
        <br></br>
        <FormMarkdown>{decisionLetterText}</FormMarkdown>
      </div>
    </div>
  );
}

export default DecisionPage;
