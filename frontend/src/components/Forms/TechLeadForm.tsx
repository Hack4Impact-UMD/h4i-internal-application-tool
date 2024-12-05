import {
    FormProps,
    TechLeadData,
  } from "../../interfaces/FormData/formDataInterfaces";
  import TextAnswer from "../FormComponents/TextAnswer";
  import { useFormPersistence } from '../../hooks/useFormPersistence';
  import { useNavigate } from "react-router-dom";
  import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'tech_lead_form_data';
  
  const TechLeadForm: React.FC<FormProps<TechLeadData>> = ({
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
            onFormDataChange(key as keyof TechLeadData, value);
          }
        });
      }
    );

    return (
      <div className="form-body">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Project Team Questions: Tech Lead (TL)</strong>
        </div>

        <div className="form-questions">
          <p>Tech Lead Responsibilities:</p>
          <p className="form-responsibilities-list">
            - point of contact for engineers to help with technologies related to their projects<br />
            - research technologies and shape the technical direction of the project<br />
            - attends team meetings<br />
            - attends meetings with nonprofit and PM<br />
            - meets with Director of Engineering weekly to discuss project progression<br />
            - review pull requests- add notes for each task on the team Kanban board before the sprint meeting<br />
            - update PMs about engineers' status, issues, and progress<br />
            - give feedback to designers on the feasibility of design<br />
          </p>
          <p>
            Note: Those applying for the engineer and/or tech lead role must also complete a technical assessment (estimated 2 hours) included in this application form.
          </p>
  
          <TextAnswer
            heading="Why do you want to become a Tech Lead at Hack4Impact-UMD?"
            subHeading="Please limit your response to a short paragraph (250 words)."
            value={sectionFormData.whyTechLead}
            onChange={(value) => onFormDataChange("whyTechLead", value)}
            required
          />
    
          <TextAnswer
            heading="Why are you a strong fit for the Tech Lead role?"
            subHeading="Please limit your response to a short paragraph (250 words)."
            value={sectionFormData.techLeadFit}
            onChange={(value) => onFormDataChange("techLeadFit", value)}
            required
          />
    
          <TextAnswer
            heading="Tell us about your experience with Git and GitHub. Additionally, if you have experience with reviewing Pull Requests, please discuss that as well."
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
            heading="Tell us about a successful project that you led or participated in and why do you think it was successful."
            subHeading="Please limit your response to a short paragraph (250 words)."
            value={sectionFormData.projectExperience}
            onChange={(value) => onFormDataChange("projectExperience", value)}
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
              onClick={() => navigate("/Engineer")}
            >Back</button>
            {/* This needs to be fixed to go to either submit or the next selected role */}
            <button 
              className="form-btn form-btn-continue"
              onClick={() => navigate("/Submit")}
            >Continue</button>
          </div>
        </div>
      </div>
    );
  };
  export default TechLeadForm;
  