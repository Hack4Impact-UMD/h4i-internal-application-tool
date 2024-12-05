import {
    FormProps,
    DemographicData,
  } from "../../interfaces/FormData/formDataInterfaces";
import TextAnswer from "../FormComponents/TextAnswer";
import Radiobox from "../FormComponents/Radiobox";
import Checkbox from "../FormComponents/Checkbox";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'general_info_form_data';
  
  const DemographicForm: React.FC<FormProps<DemographicData>> = ({
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
            onFormDataChange(key as keyof DemographicData, value);
          }
        });
      }
    );

    return (
      <div className="form-body">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Demographic Questions</strong>
        </div>

        <div className="form-questions">
  
          <TextAnswer
            heading="Pronouns"
            value={sectionFormData.pronouns}
            onChange={(value) => onFormDataChange("pronouns", value)}
            shortAnswer
          />
    
          <Radiobox
            heading="What gender do you identify with?"
            options={["Man", "Woman", "Nonbinary"]}
            value={sectionFormData.gender}
            onChange={(value) => onFormDataChange("gender", value)}
            choiceName="gender"
            other
          />
    
          <Radiobox
            heading="Do you identify as transgender?"
            options={["Yes", "No"]}
            value={sectionFormData.transgender}
            onChange={(value) => onFormDataChange("transgender", value)}
            choiceName="transgender"
          />
    
          <Checkbox
            heading="What racial or ethnic groups do you identify with?"
            options={["White or Caucasian", "Black or African American", "Hispanic or Latino", "American Indian or Alaska Native", "Asian or Pacific Islander", "North African or Middle Eastern"]}
            onChange={(value, otherUnchecked) =>
                onFormDataChange("race", value, otherUnchecked)
            }
            choiceName="race"
            other
          />

          {/* Buttons to navigate back and forth between forms */}
          <div className="form-button-container">
            <button 
              className="form-btn form-btn-back"
              onClick={() => navigate("/General-Information")}
            >Back</button>
            <button 
              className="form-btn form-btn-continue"
              onClick={() => navigate("/Choose-Role(s)")}
            >Continue</button>
          </div>
        </div>
      </div>
    );
};
export default DemographicForm;