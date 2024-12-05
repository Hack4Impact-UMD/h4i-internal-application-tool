import {
    FormProps,
    EngineerData,
  } from "../../interfaces/FormData/formDataInterfaces";
  import TextAnswer from "../FormComponents/TextAnswer";
  import { useFormPersistence } from '../../hooks/useFormPersistence';
  import { useNavigate } from "react-router-dom";
  import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'engineer_form_data';
  
  const EngineerForm: React.FC<FormProps<EngineerData>> = ({
    onFormDataChange,
    sectionFormData,
  }) => {

    const navigate = useNavigate();

    useFormPersistence(
      STORAGE_KEY,
      { ...sectionFormData, testFile: null },
      (savedData) => {
        Object.entries(savedData).forEach(([key, value]) => {
          if (value && key !== 'testFile') {
            onFormDataChange(key as keyof EngineerData, value);
          }
        });
      }
    );

    return (
      <div className="form-body">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Project Team Questions: Engineer</strong>
        </div>

        <div className="form-questions">
          <p>Engineer Responsibilities:</p>
          <p className="form-responsibilities-list">
            - responsible for implementation of all technological aspects of product<br />
            - attend team meetings<br />
            - complete assigned tasks by the given deadline<br />
            - update Tech Lead and PM with any relevant issues<br />
          </p>
          <p>
            Note: Those applying for the engineer and/or tech lead role must also complete a technical assessment (estimated 2 hours) included in this application form.
          </p>
  
          <TextAnswer
            heading="Why do you want to become an Engineer at Hack4Impact-UMD?"
            subHeading="Please limit your response to a short paragraph (250 words)."
            value={sectionFormData.whyEngineer}
            onChange={(value) => onFormDataChange("whyEngineer", value)}
            required
          />
    
          <TextAnswer
            heading="Why are you a strong fit for the Engineer role?"
            subHeading="Please limit your response to a short paragraph (250 words)."
            value={sectionFormData.engineerFit}
            onChange={(value) => onFormDataChange("engineerFit", value)}
            required
          />
    
          <TextAnswer
            heading="Tell us about your experience with Git and GitHub."
            value={sectionFormData.gitExperience}
            onChange={(value) => onFormDataChange("gitExperience", value)}
            required
          />
    
          <TextAnswer
            heading="Please talk about the different languages or frameworks (Ex. Node, React, etc.) you have experience in and give a brief description of the experience you have in each."
            value={sectionFormData.codeExperience}
            onChange={(value) => onFormDataChange("codeExperience", value)}
            required
          />
    
          <TextAnswer
            heading="Tell us about a mistake you made while working on a coding project (in class, internship, research, or for fun). How did you handle it?"
            subHeading="Please limit your response to a short paragraph (250 words)."
            value={sectionFormData.mistakeExperience}
            onChange={(value) => onFormDataChange("mistakeExperience", value)}
            required
          />
    
          <TextAnswer
            heading="Describe your experience working in engineering teams and/or working in sprints, if any. This is NOT a prerequisite for joining but gives us an idea of the experience level."
            value={sectionFormData.sprintExperience}
            onChange={(value) => onFormDataChange("sprintExperience", value)}
            required
          />

          <TextAnswer
              heading="Completed Assessment GitHub Repo URL"
              subHeading= "e.g. https://github.com/username/FirstnameLastname-h4i-assessment-fall2024.\n Please ensure that your repository is private and that Hack4ImpactUMD is added as a collaborator.\n Only submit the application once you have completed the assessment and DO NOT continue working after the deadline. Thank you!"
              value={sectionFormData.technicalSubmission}
              onChange={(value) => onFormDataChange("technicalSubmission", value)}
              shortAnswer
              required
          />

          <TextAnswer
            heading="Comments/Notes"
            value={sectionFormData.comments}
            onChange={(value) => onFormDataChange("comments", value)}
          />

          {/* Buttons to navigate back and forth between forms */}
          <div className="form-button-container">
            {/* This needs to be fixed to go to either choose roles or the previous selected role */}
            <button 
              className="form-btn form-btn-back"
            onClick={() => navigate("/UX-Design")}
            >Back</button>
            {/* This needs to be fixed to go to either submit or the next selected role */}
            <button 
              className="form-btn form-btn-continue"
            onClick={() => navigate("/Tech-Lead")}
            >Continue</button>
          </div>
        </div>
      </div>
    );
  };
  export default EngineerForm;
  