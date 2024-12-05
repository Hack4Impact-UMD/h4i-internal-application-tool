import {
    FormProps,
    EngineerData,
  } from "../../interfaces/FormData/formDataInterfaces";
  import TextAnswer from "../FormComponents/TextAnswer";
  
  const EngineerForm: React.FC<FormProps<EngineerData>> = ({
    onFormDataChange,
    sectionFormData,
  }) => {
    return (
      <div>
        <div>
          <strong>Engineer Responsibilities</strong> 
          <p>responsible for implementation...</p>
        </div>
  
        <TextAnswer
          heading="Why do you want to become an Engineer at Hack4Impact-UMD?"
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.whyEngineer}
          onChange={(value) => onFormDataChange("whyEngineer", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Why are you a strong fit for the Engineer role?"
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.engineerFit}
          onChange={(value) => onFormDataChange("engineerFit", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Tell us about your experience with Git and GitHub."
          value={sectionFormData.gitExperience}
          onChange={(value) => onFormDataChange("gitExperience", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Please talk about the different languages or frameworks (Ex. Node, React, etc.) you have experience in and give a brief description of the experience you have in each."
          value={sectionFormData.codeExperience}
          onChange={(value) => onFormDataChange("codeExperience", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Tell us about a mistake you made while working on a coding project (in class, internship, research, or for fun). How did you handle it?"
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.mistakeExperience}
          onChange={(value) => onFormDataChange("mistakeExperience", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Describe your experience working in engineering teams and/or working in sprints, if any. This is NOT a prerequisite for joining but gives us an idea of the experience level."
          value={sectionFormData.sprintExperience}
          onChange={(value) => onFormDataChange("sprintExperience", value)}
          placeholder="Long answer text"
          required
        />

        <TextAnswer
            heading="Completed Assessment GitHub Repo URL"
            subHeading= "e.g. https://github.com/username/FirstnameLastname-h4i-assessment-fall2024.\n Please ensure that your repository is private and that Hack4ImpactUMD is added as a collaborator.\n Only submit the application once you have completed the assessment and DO NOT continue working after the deadline. Thank you!"
            value={sectionFormData.technicalSubmission}
            onChange={(value) => onFormDataChange("technicalSubmission", value)}
            placeholder="Long answer text"
            required
        />

        <TextAnswer
          heading="Comments/Notes"
          value={sectionFormData.comments}
          onChange={(value) => onFormDataChange("comments", value)}
          placeholder="Long answer text"
        />
       
      </div>
    );
  };
  export default EngineerForm;
  