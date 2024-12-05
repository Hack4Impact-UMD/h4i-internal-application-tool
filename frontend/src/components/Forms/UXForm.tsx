import React from "react";
import { UXData } from "../../interfaces/FormData/formDataInterfaces";
import FileUpload from "../FormComponents/FileUpload";

import Radiobox from "../FormComponents/Radiobox";
import TextAnswer from "../FormComponents/TextAnswer";
interface UXFormProps {
  onFormDataChange: (field: keyof UXData, value: any) => void;
  sectionFormData: UXData;
}

const UXForm: React.FC<UXFormProps> = ({ onFormDataChange, sectionFormData }) => {
  return (
    <div>
        <div>
        <strong>UX Application Questions</strong> add description...
        </div>

        <TextAnswer
            heading="Why do you want to become a Designer at Hack4Impact-UMD?"
            value={sectionFormData.whyUX}
            onChange={(value) => onFormDataChange("whyUX", value)}
            placeholder="Long answer text"
            required
        />

        <TextAnswer
            heading="Why are you a strong fit for the Designer role?"
            value={sectionFormData.strongFit}
            onChange={(value) => onFormDataChange("strongFit", value)}
            placeholder="Long answer text"
            required
        />

        <TextAnswer
            heading = "Describe your design workflow."
            value = {sectionFormData.workflow}
            onChange = {(value) => onFormDataChange("workflow", value)}
            placeholder="Long answer text"
            required
        />

        <TextAnswer
            heading = "How do you respond to negative feedback from a client/stakeholder?"
            value={sectionFormData.situationalResponse}
            onChange={(value) => onFormDataChange("situationalResponse", value)}
            placeholder="Long answer text"
            required
        />

        <TextAnswer
            heading = "How do you collaborate with other designers and engineers? Please also discuss how you would handle conflicts within a team."
            value={sectionFormData.collaboration}
            onChange={(value) => onFormDataChange("collaboration", value)}
            placeholder="Long answer text"
            required
        />

        <TextAnswer
            heading = "Tell us about your experience using Figma. If you have not used Figma before, please tell us about your experience using other design applications."
            value={sectionFormData.figmaExp}
            onChange={(value) => onFormDataChange("figmaExp", value)}
            placeholder="Long answer text"
            required
        />

        <Radiobox
            heading = "How many year of design-related experience do you have?"
            options = {["0", "1", "2", "3"]}
            value = {sectionFormData.yoe}
            onChange={(value) => onFormDataChange("yoe", value)}
            choiceName = "Years of experience"
            required
            other
        />

        <TextAnswer
            heading = "Provide a link to your portfolio."
            value={sectionFormData.portfolio}
            onChange={(value) => onFormDataChange("portfolio", value)}
            placeholder = "Portfolio link"
            required
        />

        <FileUpload
            heading = "Upload any additional supporting attachments. (You may also upload a file as your porfolio if you prefer)"
            onChange = {(file) => onFormDataChange("attachments", file)}
        />
    </div>
  );
};

export default UXForm;