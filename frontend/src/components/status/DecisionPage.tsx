import { useAuth } from "@/hooks/useAuth";
import { ApplicantRole, ReviewStatus } from "@/types/types";
import { useParams } from "react-router-dom";
import { useMyApplicationStatus } from "@/hooks/useApplicationStatus";
import { displayApplicantRoleName } from "@/utils/display";
import Spinner from "../Spinner";
import FormMarkdown from "../form/FormMarkdown";
import ErrorPage from "@/pages/ErrorPage";

// using this for now, need to figure out types to include decision letters
function getDecisionMessage(status?: ReviewStatus | "decided"): string {
  switch (status) {
    case ReviewStatus.Accepted:
      return "Congratulations! Your application has been accepted.";
    case ReviewStatus.Denied:
      return "Thank you for your interest in this role at Hack4Impact-UMD. Unfortunately, your application was not selected.";
    case ReviewStatus.Waitlisted:
      return "Thank you for your interest in this role at Hack4Impact-UMD. Due to the high volume of applicants, your application has been waitlisted.";
    default:
      return "You're not supposed to be on this page.";
  }
}

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
        <FormMarkdown>{getDecisionMessage(appStatus?.status)}</FormMarkdown>
      </div>
    </div>
  );
}

export default DecisionPage;
