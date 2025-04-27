import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { fetchOrCreateApplicationResponse } from "../../services/applicationResponsesService";
import { ApplicationForm } from "../../types/types";

type ApplicationCardProps = {
  form: ApplicationForm
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  form
}) => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const formattedDueDate = form.dueDate.toDate().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });


  const handleApply = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      if (!form?.id) {
        console.error("Form ID is undefined");
        return;
      }

      const applicationResponseId = await fetchOrCreateApplicationResponse(user.id, form);

      const firstSectionId = form.sections[0]?.sectionId || "section-1";
      navigate(`/apply/${applicationResponseId}/${firstSectionId}`, {
        state: { form: form, applicationResponseId, userId: user.id },
      });
    } catch (error) {
      console.error("Error creating or retrieving application response:", error);
    }
  };

  return (
    <div className="border rounded-md p-6 shadow-md flex flex-col gap-3 bg-white max-w-lg w-full">
      <h2 className="text-xl font-semibold cursor-pointer">{form.id}</h2>
      <p className="text-sm text-gray-600">Due: <b>{formattedDueDate}</b></p>
      <Button
        className="bg-[#202020] py-1.5 px-9 rounded-3xl text-md font-bold"
        type="button"
        onClick={handleApply}
      > Apply </Button>
    </div>
  );
};

export default ApplicationCard;
