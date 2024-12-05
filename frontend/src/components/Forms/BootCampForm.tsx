import {
  BootCampData,
  FormProps,
} from "../../interfaces/FormData/formDataInterfaces";

import TextAnswer from "../FormComponents/TextAnswer";

// Consider the question of interest in applying for porject teams

const BootCampForm: React.FC<FormProps<BootCampData>> = ({
  onFormDataChange,
  sectionFormData,
}) => {
  return (
    <div>
      <div>
        <strong>Bootcamp Questions</strong> add description...
      </div>

      <TextAnswer
        heading="Tell us why you are interested in joining the bootcamp."
        subHeading="Please limit your response to a short paragrah (250 words)."
        value={sectionFormData.interest}
        onChange={(value) => onFormDataChange("interest", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="Tell us about a time you had to learn a new skill to accomplish a task."
        value={sectionFormData.newSkill}
        onChange={(value) => onFormDataChange("newSkill", value)}
        placeholder="Long answer text"
        required
      />

      <TextAnswer
        heading="Describe a time when you had to persist through a significant challenge. How did you approach it and what did you learn from that experience?"
        value={sectionFormData.challengePersist}
        onChange={(value) => onFormDataChange("challengePersist", value)}
        placeholder="Long answer text"
        required
      />
    </div>
  );
};

export default BootCampForm;
