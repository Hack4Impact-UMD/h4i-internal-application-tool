import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../Button";
import { ApplicationForm } from "../../types/types";
import { fetchOrCreateApplicationResponse } from "../../services/applicationResponsesService";

interface ApplicationPreviewProps {
  form?: ApplicationForm;
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({ form }) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fallbackForm = location.state?.form as ApplicationForm | undefined;
  const finalForm = form || fallbackForm;

  const handleApply = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      if (!finalForm?.id) {
        console.error("Form ID is undefined");
        return;
      }

      const applicationResponseId = await fetchOrCreateApplicationResponse(user.id, finalForm);

      const firstSectionId = finalForm.sections[0]?.sectionId || "section-1";
      navigate(`/apply/${applicationResponseId}/${firstSectionId}`, {
        state: { form: finalForm, applicationResponseId, userId: user.id },
      });
    } catch (error) {
      console.error("Error creating or retrieving application response:", error);
    }
  };

  if (!finalForm) {
    return <div>Form not found for ID: {params.formId}</div>;
  }

  const formattedDueDate = finalForm.dueDate.toDate().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <div className="flex flex-col m-8 w-3/4 justify-self-center max-h-180 p-6">
        <span className="text-4xl">Overview</span>
        <div className="mt-4 flex flex-row justify-between items-center">
          <div className="w-2/5">
            <span className="text-xl text-[#317FD0]">{finalForm.id}</span>
          </div>
          <div>
            <Button
              className="bg-[#202020] py-1.5 px-9 rounded-3xl text-md font-bold"
              enabled={finalForm.isActive}
              type="button"
              onClick={handleApply}
            > Apply </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Due Date: {formattedDueDate}
        </div>

        <div className="flex flex-col gap-2.5 mt-8 text-sm overflow-auto">
          {finalForm.description}
        </div>
      </div>
    </>
  );
};

export default ApplicationPreview;
