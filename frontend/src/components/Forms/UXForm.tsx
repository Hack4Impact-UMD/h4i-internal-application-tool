import React from "react";
import {
  FormProps,
  UXData,
} from "../../interfaces/FormData/formDataInterfaces";
import Radiobox from "../FormComponents/Radiobox";
import TextAnswer from "../FormComponents/TextAnswer";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'UX_form_data';

  const UXForm: React.FC<FormProps<UXData>> = ({
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
              onFormDataChange(key as keyof UXData, value);
            }
          });
        }
      );

  return (
    <div className="form-body">
      <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Project Team Questions: Designer</strong>
        </div>

        <div className="form-questions">
          <p>Designer Responsibilities:</p>
          <p className="form-responsibilities-list">
            - responsible for creating the frontend designs for the product based on nonprofit needs<br />
            - attends team meetings<br />
            - attends meetings with nonprofit and PM<br />
            - meets with Director of Design to discuss project progression<br />
            - walkthrough designs and get nonprofit's feedback<br />
            - communicate with engineers on designs and whether or not they are feasible<br />
            - complete tasks by the given deadline so that the engineers have enough time to do their tasks as well<br />
            - provide feedback to engineers on their implementation of the designs<br />
          </p>

        <TextAnswer
            heading="Why do you want to become a Designer at Hack4Impact-UMD?"
            value={sectionFormData.whyUX}
            onChange={(value) => onFormDataChange("whyUX", value)}
            required
        />

        <TextAnswer
            heading="Why are you a strong fit for the Designer role?"
            value={sectionFormData.strongFit}
            onChange={(value) => onFormDataChange("strongFit", value)}
            required
        />

        <TextAnswer
            heading = "Describe your design workflow."
            value = {sectionFormData.workflow}
            onChange = {(value) => onFormDataChange("workflow", value)}
            required
        />

        <TextAnswer
            heading = "How do you respond to negative feedback from a client/stakeholder?"
            value={sectionFormData.situationalResponse}
            onChange={(value) => onFormDataChange("situationalResponse", value)}
            required
        />

        <TextAnswer
            heading = "How do you collaborate with other designers and engineers? Please also discuss how you would handle conflicts within a team."
            value={sectionFormData.collaboration}
            onChange={(value) => onFormDataChange("collaboration", value)}
            required
        />

        <TextAnswer
            heading = "Tell us about your experience using Figma. If you have not used Figma before, please tell us about your experience using other design applications."
            value={sectionFormData.figmaExp}
            onChange={(value) => onFormDataChange("figmaExp", value)}
            required
        />

        <Radiobox
            heading = "How many year of design-related experience do you have?"
            options = {["0", "1", "2", "3+"]}
            value = {sectionFormData.yoe}
            onChange={(value) => onFormDataChange("yoe", value)}
            choiceName = "Years of experience"
            required
        />

        <TextAnswer
            heading = "Share your portfolio or previous design projects"
            value={sectionFormData.portfolio}
            onChange={(value) => onFormDataChange("portfolio", value)}
            shortAnswer
            required
        />

        {/* Buttons to navigate back and forth between forms */}
        <div className="form-button-container">
          {/* This needs to be fixed to go to either choose roles or the previous selected role */}
          <button 
            className="form-btn form-btn-back"
            onClick={() => navigate("/Product-Manager")}
          >Back</button>
          {/* This needs to be fixed to go to either submit or the next selected role */}
          <button 
            className="form-btn form-btn-continue"
            onClick={() => navigate("/Engineer")}
          >Continue</button>
        </div>
      </div>
    </div>
  );
};

export default UXForm;