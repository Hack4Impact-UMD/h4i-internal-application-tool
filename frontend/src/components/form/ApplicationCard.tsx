import React from "react";
import Button from "../Button";
import { ApplicationForm, QuestionType, SectionResponse } from "../../types/types";
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import { fetchOrCreateApplicationResponse, getApplicationResponseByFormId } from "../../services/applicationResponsesService";

type ApplicationCardProps = {
  form: ApplicationForm
  onClick: () => void;
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  form,
  onClick
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
      <h2 className="text-xl font-semibold cursor-pointer" onClick={onClick}>{form.id}</h2>
      <p className="text-sm text-gray-600">Due: <b>{formattedDueDate}</b></p>
      <Button
        className="bg-[#202020] py-1.5 px-9 rounded-3xl text-md font-bold"
        label="Apply"
        type="button"
        enabled={true}
        onClick={handleApply}
      />
    </div>
  );
};

export default ApplicationCard;
