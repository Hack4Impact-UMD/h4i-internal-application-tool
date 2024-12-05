import React from "react";
import {
  FormProps,
  SourcingData,
} from "../../interfaces/FormData/formDataInterfaces";
import TextAnswer from "../FormComponents/TextAnswer";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'sourcing_form_data';

  const SourcingForm: React.FC<FormProps<SourcingData>> = ({
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
          onFormDataChange(key as keyof SourcingData, value);
        }
      });
    }
  );

  return (
    <div className="form-body">
      <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Sourcing Questions</strong>
        </div>

        <div className="form-questions">
          <p>
            The sourcing team is responsible for reaching out to and communicating with non-profit organizations to secure projects 
            for Hack4Impact-UMD. This is an excellent opportunity for those in public policy, in business, or looking to sharpen 
            their communication skills while making an impact. As a part of the team, you would email and/or call potential nonprofits 
            and you could potentially be a part of our meetings with them. This team is vital to our organization and gives those who 
            might not be ready or interested in technical projects the opportunity to leave an impact as part of our organization.
          </p>

        <TextAnswer
          heading = "Do you have any experience communicating professionally on behalf of a club/organization, and if so, can you briefly describe what you did?"
          value = {sectionFormData.clubExp}
          onChange = {(value) => onFormDataChange("clubExp", value)}
          required
        />

        <TextAnswer
          heading = "How comfortable are you going on video calls with a potential nonprofit organization?"
          value = {sectionFormData.videoCalls}
          onChange = {(value) => onFormDataChange("videoCalls", value)}
          required
        />

        <TextAnswer
          heading = "Why would you be a good sourcing team member?"
          value = {sectionFormData.strongFit}
          onChange = {(value) => onFormDataChange("strongFit", value)}
          required
        />

        <TextAnswer
          heading = "Find 2 nonprofits in the D.C./Maryland/Virginia area that would be good fits for projects with Hack4Impact-UMD. For each nonprofit, provide a two-sentence explanation as to why you think this nonprofit would be a good fit."
          value = {sectionFormData.exampleTask}
          onChange = {(value) => onFormDataChange("exampleTask", value)}
          required
        />

        <TextAnswer
          heading = "Do you have any prior experience working with Nonprofit Organizations? If not, please put N/A."
          value = {sectionFormData.npoExp}
          onChange = {(value) => onFormDataChange("npoExp", value)}
          required
        />

        {/* Buttons to navigate back and forth between forms */}
        <div className="form-button-container">
          {/* This needs to be fixed to go to either choose roles or the previous selected role */}
          <button 
            className="form-btn form-btn-back"
            onClick={() => navigate("/Bootcamp")}
          >Back</button>
          {/* This needs to be fixed to go to either submit or the next selected role */}
          <button 
            className="form-btn form-btn-continue"
            onClick={() => navigate("/Product-Manager")}
          >Continue</button>
        </div>
      </div>
    </div>
  );
};

export default SourcingForm;