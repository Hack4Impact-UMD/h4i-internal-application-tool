import {
  FormProps,
  ProductManagerData,
} from "../../interfaces/FormData/formDataInterfaces";
import Checkbox from "../FormComponents/Checkbox";
import FileUpload from "../FormComponents/FileUpload";

import Radiobox from "../FormComponents/Radiobox";
import TextAnswer from "../FormComponents/TextAnswer";

const ProductManagerForm: React.FC<FormProps<ProductManagerData>> = ({
  onFormDataChange,
  sectionFormData,
}) => {
  return (
    <div>
      <div>
        <strong>PM Responsibilies</strong> add later
      </div>

      <TextAnswer
        heading="Why do you want to become a PM at Hack4Impact-UMD and why are you a strong fit for this role?"
        subHeading="Please limit your response to 500 words."
        value={sectionFormData.whyPM}
        onChange={(value) => onFormDataChange("whyPM", value)}
        // onChange={(value) => handleFieldChange("whyPM", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="Tell us about a time you led a team and how you delegated work amongst your team?"
        subHeading="Please limit your response to 500 words."
        value={sectionFormData.ledAndDelegate}
        onChange={(value) => onFormDataChange("ledAndDelegate", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="How do you recognize that a project is off-track and what would you do to address it?"
        value={sectionFormData.offTrack}
        onChange={(value) => onFormDataChange("offTrack", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="How do you manage unmotivated team members or team members who are not working to their full potential?"
        subHeading="Please limit your response to a short paragraph (250 words)."
        value={sectionFormData.unmotivatedTeam}
        onChange={(value) => onFormDataChange("unmotivatedTeam", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="Tell us about a time you couldn't meet a goal or deadline and how you dealt with/learned from it."
        value={sectionFormData.failedDeadline}
        onChange={(value) => onFormDataChange("failedDeadline", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="Respond to the following scenario: 2 weeks out from the project deadline, the client reaches out and proposes several new features that were not previously discussed, how do you handle this situation?"
        value={sectionFormData.scenario}
        onChange={(value) => onFormDataChange("scenario", value)}
        placeholder="Long answer text"
        required
      />

      <Radiobox
        heading="Are you familiar with using Notion"
        options={["Yes", "No"]}
        value={sectionFormData.useNotion}
        onChange={(value) => onFormDataChange("useNotion", value)}
        choiceName="notion"
        required
        other
      />

      {/* Sample Checkbox, be sure you the name to the interface and in checkboxes.ts */}
      <Checkbox
        heading="Testing Checkboxn"
        options={["Yes", "No"]}
        onChange={(value, otherUnchecked) =>
          onFormDataChange("testCB", value, otherUnchecked)
        }
        choiceName="testCB"
        other
      />

      {/* Sample FileUpload */}
      <FileUpload
        heading="Resume"
        onChange={(file) => onFormDataChange("testFile", file)}
      />
    </div>
  );
};
export default ProductManagerForm;
