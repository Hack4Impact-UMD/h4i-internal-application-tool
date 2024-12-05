import {
  BootCampData,
  FormProps,
} from "../../interfaces/FormData/formDataInterfaces";

import TextAnswer from "../FormComponents/TextAnswer";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'product_manager_form_data';

// Consider the question of interest in applying for project teams
const BootCampForm: React.FC<FormProps<BootCampData>> = ({
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
          onFormDataChange(key as keyof BootCampData, value);
        }
      });
    }
  );

  return (
    <div className="form-body">
      <img className="form-logo" src={h4iLogo} alt="H4I" />
      <div className="form-heading">
        <strong>Bootcamp Questions</strong>
      </div>

      <div className="form-questions">
        <p>
          Please answer the following questions if you are interested in bootcamp. We will be especially looking at the quality of 
          your responses since you will not be interviewed for this role.
        </p>
        <p>
          Bootcamp essentially teaches members the foundation to join a project team. In bootcamp, students learn web development 
          skills starting from basic HTML, JavaScript, and CSS and then building up to the MERN (MongoDB, Express, React, Node.js) 
          stack. The goal is for members to complete bootcamp and then join a project team the following semester. Similar to project 
          teams, we are looking for motivated and committed students to join bootcamp and continue working with our nonprofit partners. 
          The bootcamp workflow involves weekly bootcamp meetings, doing the bootcamp assignments during the week, and chapter wide 
          meetings monthly. The time commitment is around 3-5 hours a week.
        </p>
        <TextAnswer
          heading="Tell us why you are interested in joining the bootcamp."
          subHeading="Please limit your response to a short paragrah (250 words)."
          value={sectionFormData.interest}
          onChange={(value) => onFormDataChange("interest", value)}
          required
        />

        <TextAnswer
          heading="Tell us about a time you had to learn a new skill to accomplish a task."
          value={sectionFormData.newSkill}
          onChange={(value) => onFormDataChange("newSkill", value)}
          required
        />

        <TextAnswer
          heading="Describe a time when you had to persist through a significant challenge. How did you approach it and what did you learn from that experience?"
          value={sectionFormData.challengePersist}
          onChange={(value) => onFormDataChange("challengePersist", value)}
          required
        />

        {/* Buttons to navigate back and forth between forms */}
        <div className="form-button-container">
          <button 
            className="form-btn form-btn-back"
            onClick={() => navigate("/Choose-Role(s)")}
          >Back</button>
          {/* This needs to be fixed to go to either submit or the next selected role */}
          <button 
            className="form-btn form-btn-continue"
            onClick={() => navigate("/sourcing")}
          >Continue</button>
        </div>
      </div>
    </div>
  );
};

export default BootCampForm;
