import {
    FormProps,
    TechLeadData,
  } from "../../interfaces/FormData/formDataInterfaces";
  import TextAnswer from "../FormComponents/TextAnswer";
  
  const TechLeadForm: React.FC<FormProps<TechLeadData>> = ({
    onFormDataChange,
    sectionFormData,
  }) => {
    return (
      <div>
        <div>
          <strong>Tech Lead Responsibilities</strong> 
          <p>responsible for implementation...</p>
        </div>
  
        <TextAnswer
          heading="Why do you want to become a Tech Lead at Hack4Impact-UMD?"
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.whyTechLead}
          onChange={(value) => onFormDataChange("whyTechLead", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Why are you a strong fit for the Tech Lead role?"
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.techLeadFit}
          onChange={(value) => onFormDataChange("techLeadFit", value)}
          placeholder="Long answer text"
          required
        />
  
        <TextAnswer
          heading="Tell us about your experience with Git and GitHub. Additionally, if you have experience with reviewing Pull Requests, please discuss that as well."
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
          heading="Tell us about a successful project that you led or participated in and why do you think it was successful."
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.projectExperience}
          onChange={(value) => onFormDataChange("projectExperience", value)}
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
  export default TechLeadForm;
  