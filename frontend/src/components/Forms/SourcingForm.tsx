import React from "react";
import { SourcingData } from "../../interfaces/FormData/formDataInterfaces";
import TextAnswer from "../FormComponents/TextAnswer";

interface SourcingFormProps {
  onFormDataChange: (field: keyof SourcingData, value: any) => void;
  sectionFormData: SourcingData;
}

const SourcingForm: React.FC<SourcingFormProps> = ({ onFormDataChange, sectionFormData }) => {
  return (
    <div>
      <div>
        <strong>Sourcing Application Questions</strong> add description...
      </div>

      <TextAnswer
        heading = "Do you have any experience communicating professionally on behalf of a club/organization, and if so, can you briefly describe what you did?"
        value = {sectionFormData.clubExp}
        onChange = {(value) => onFormDataChange("clubExp", value)}
        placeholder = "Long answer text"
        required
      />

      <TextAnswer
        heading = "How comfortable are you going on video calls with a potential nonprofit organization?"
        value = {sectionFormData.videoCalls}
        onChange = {(value) => onFormDataChange("videoCalls", value)}
        placeholder = "Long answer text"
        required
      />

      <TextAnswer
        heading = "Why would you be a good sourcing team member?"
        value = {sectionFormData.strongFit}
        onChange = {(value) => onFormDataChange("strongFit", value)}
        placeholder = "Long answer text"
        required
      />

      <TextAnswer
        heading = "Find 2 nonprofits in the D.C./Maryland/Virginia area that would be good fits for projects with Hack4Impact-UMD. For each nonprofit, provide a two-sentence explanation as to why you think this nonprofit would be a good fit."
        value = {sectionFormData.exampleTask}
        onChange = {(value) => onFormDataChange("exampleTask", value)}
        placeholder = "Long answer text"
        required
      />

      <TextAnswer
        heading = "Do you have any prior experience working with Nonprofit Organizations? If not, please put N/A."
        value = {sectionFormData.npoExp}
        onChange = {(value) => onFormDataChange("npoExp", value)}
        placeholder = "Long answer text"
        required
      />
    </div>
  );
};

export default SourcingForm;