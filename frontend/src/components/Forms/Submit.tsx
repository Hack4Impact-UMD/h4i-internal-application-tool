import React from "react";
import { handleChanges } from "../../handleFormChanges/handleChanges";
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const ReviewandSubmit: React.FC = () => {
    const { formData } = handleChanges();

    const navigate = useNavigate();
    
    const handleEdit = (section: string) => {
        switch (section) {
          case "General Questions":
            navigate("/General-Information");
            break;
          case "Demographic Questions":
            navigate("/Demographic-Questions");
            break;
          case "Choose Roles":
            navigate("/Choose-Role(s)");
            break;
          case "Bootcamp Questions":
            navigate("/Bootcamp");
            break;
          case "Sourcing Questions":
            navigate("/Sourcing");
            break;
          case "Product Manager Questions":
            navigate("/Product-Manager");
            break;
          case "UX/Design Questions":
            navigate("/UX-Design");
            break;
          case "Engineer Questions":
            navigate("/Engineer");
            break;
          case "Tech Lead Questions":
            navigate("/Tech-Lead");
            break;
          default:
            console.log(`Unknown section: ${section}`);
            break;
        }
      };
  
    const handleSubmit = () => {
      // Submit the formData to the backend or API
      console.log("Form Data Submitted:", formData);
    };
  
    return (
      <div className="form-body form-body-submit">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
            <strong>Review and Submit</strong>
        </div>


        <div className="form-questions">
            {/* General Info Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">General Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("General Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Email:</strong> {formData.generalInfoData.email}</p>
                <p><strong>Full Name:</strong> {formData.generalInfoData.name}</p>
                 Add other fields */}
            </div>
    
            {/* Demographic Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Demographic Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Demographic Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Pronouns:</strong> {formData.demographicData.pronouns}</p>
                <p><strong>Gender:</strong> {formData.demographicData.gender}</p>
                 Add other fields */}
            </div>
    
            {/* Roles Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Choose Roles</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Choose Roles")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Roles:</strong> {formData.rolesData.roles.join(", ")}</p>*/}
            </div>

            {/* Bootcamp Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Bootcamp Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Bootcamp Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Why do you want to be an Engineer?</strong></p>
                <p>{formData.engineerData.whyEngineer}</p>
                 Add other fields */}
            </div>

            {/* Sourcing Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Sourcing Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Sourcing Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Why do you want to be an Engineer?</strong></p>
                <p>{formData.engineerData.whyEngineer}</p>
                 Add other fields */}
            </div>

            {/* Product Manager Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Product Manager Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Product Manager Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Why do you want to be an Engineer?</strong></p>
                <p>{formData.engineerData.whyEngineer}</p>
                 Add other fields */}
            </div>

            {/* UX/Design Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">UX/Design Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("UX/Design Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Why do you want to be an Engineer?</strong></p>
                <p>{formData.engineerData.whyEngineer}</p>
                 Add other fields */}
            </div>
    
            {/* Engineer Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Engineer Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Engineer Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Why do you want to be an Engineer?</strong></p>
                <p>{formData.engineerData.whyEngineer}</p>
                 Add other fields */}
            </div>

            {/* Tech Lead Questions Section */}
            <div>
                <div className="form-submit-sections">
                    <p className="form-submit-heading">Tech Lead Questions</p>
                    <button className="form-btn form-btn-submit" onClick={() => handleEdit("Tech Lead Questions")}>
                        Edit Section
                    </button>
                </div>
                {/*<p><strong>Why do you want to be an Engineer?</strong></p>
                <p>{formData.engineerData.whyEngineer}</p>
                 Add other fields */}
            </div>
    
            {/* Submit Button */}
            <div className="form-button-container">
                <button className="form-btn form-btn-back-submit" onClick={() => navigate("/Tech-Lead")}>
                    Back
                </button>
                <button className="form-btn form-btn-submit" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
      </div>
    );
  };

export default ReviewandSubmit;