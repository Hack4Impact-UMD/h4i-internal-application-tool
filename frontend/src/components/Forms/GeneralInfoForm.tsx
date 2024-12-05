import {
    FormProps,
    GeneralInfoData,
  } from "../../interfaces/FormData/formDataInterfaces";
import TextAnswer from "../FormComponents/TextAnswer";
import Radiobox from "../FormComponents/Radiobox";
import Checkbox from "../FormComponents/Checkbox";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'general_info_form_data';
  
  const GeneralInfoForm: React.FC<FormProps<GeneralInfoData>> = ({
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
            onFormDataChange(key as keyof GeneralInfoData, value);
          }
        });
      }
    );

    return (
      <div className="form-body">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>General Questions</strong>
        </div>

        <div className="form-questions">
  
          <TextAnswer
            heading="Email"
            value={sectionFormData.email}
            onChange={(value) => onFormDataChange("email", value)}
            shortAnswer
            required
          />
    
          <TextAnswer
            heading="Full Name (First and Last Name)"
            value={sectionFormData.name}
            onChange={(value) => onFormDataChange("name", value)}
            shortAnswer
            required
          />
    
          <TextAnswer
            heading="Name you prefer to be called (if any)"
            value={sectionFormData.preferredName}
            onChange={(value) => onFormDataChange("preferredName", value)}
            shortAnswer
          />
    
          <Radiobox
            heading="Year in School"
            options={["Freshman", "Sophomore", "Junior", "Senior"]}
            value={sectionFormData.year}
            onChange={(value) => onFormDataChange("year", value)}
            choiceName="year"
            required
            other
          />

          <TextAnswer
            heading="Major"
            value={sectionFormData.major}
            onChange={(value) => onFormDataChange("major", value)}
            shortAnswer
            required
          />

          <TextAnswer
            heading="Minor(s)"
            value={sectionFormData.minor}
            onChange={(value) => onFormDataChange("minor", value)}
            shortAnswer
          />

          <Checkbox
            heading="What CS classes have you taken?"
            subHeading="CS classes are NOT a requirement for members, we take all majors!"
            boldSubHeading="[You must be a current/incoming student at the University of Maryland, College Park]"
            options={["CMSC 131", "CMSC 132", "CMSC 216", "CMSC 250", "CMSC 320", "CMSC 335", "CMSC 330", "CMSC 351", 
              "CMSC 388J", "CMSC 389N"]}
            onChange={(value, otherUnchecked) =>
              onFormDataChange("csClasses", value, otherUnchecked)
            }
            choiceName="csClasses"
            other
          />

          <Checkbox
            heading="Technical Skills"
            subHeading="We consider applicants with all experience levels! You are not required to have technical experience, just 
            a willingness to learn. People with fewer technical skills, but sufficient interest and passion, may be placed on a 
            bootcamp group. If you don't have any of these yet, don't worry (especially if you're interested in sourcing). Please 
            only check the following skills that you have used for a project (in class, internship, research, or for fun)."
            options={["Frontend development", "Backend development", "RESTful APIs", "React.js", "HTML/CSS", "JavaScript", "TypeScript", 
              "Python", "SQL", "Firebase", "MongoDB", "Flask", "Node.js and Express", "Vue", "AWS", "Content Management System (CMS)se",
              "Data Visualization (d3.js or other libraries)", "Figma", "None"]}
            onChange={(value, otherUnchecked) =>
              onFormDataChange("csTopics", value, otherUnchecked)
            }
            choiceName="csTopics"
            other
          />

          <TextAnswer
            heading="Aside from tech related things, do you have other cool skills? (photography, video editing, social media, 
            marketing, nonprofit sourcing, teaching, etc.)"
            value={sectionFormData.skills}
            onChange={(value) => onFormDataChange("skills", value)}
            required
          />

          <TextAnswer
            heading="Resume"
            subHeading="Submit a link to your resume"
            value={sectionFormData.resume}
            onChange={(value) => onFormDataChange("resume", value)}
            placeholder="Insert resume link"
            shortAnswer
            required
          />

          <TextAnswer
            heading="Why do you what to join Hack4Impact-UMD?"
            value={sectionFormData.whyH4I}
            onChange={(value) => onFormDataChange("whyH4I", value)}
            required
          />

          <TextAnswer
            heading="In your opinion, what differentiates Hack4Impact-UMD from other student clubs / opportunities on campus?"
            value={sectionFormData.differences}
            onChange={(value) => onFormDataChange("differences", value)}
            required
          />

          <TextAnswer
            heading="How did you hear about us?"
            value={sectionFormData.awareness}
            onChange={(value) => onFormDataChange("awareness", value)}
            required
          />

          <TextAnswer
            heading="Other commitments"
            subHeading="Please list out the other activities and commitments you expect to have this year. Please indicate their 
            approximate hours/week and also indicate approximately how many hours/week you plan to devote to Hack4impact-UMD. We 
            expect new members to commit at least 5 hours per week towards Hack4Impact-UMD. You should not consider applying if 
            you think you will drop this club during the semester."
            value={sectionFormData.commitments}
            onChange={(value) => onFormDataChange("commitments", value)}
            required
          />

          <TextAnswer
            heading="Considering the weekly commitment is at least 5 hours, how do you plan on staying involved in Hack4Impact-UMD?"
            value={sectionFormData.involvement}
            onChange={(value) => onFormDataChange("involvement", value)}
            required
          />

          <TextAnswer
            heading="What is a social initiative you’re interested in and how would you use your technical abilities to help?"
            value={sectionFormData.initiative}
            onChange={(value) => onFormDataChange("initiative", value)}
            required
          />

          <TextAnswer
            heading="How have you given back to the community recently?"
            value={sectionFormData.giveBack}
            onChange={(value) => onFormDataChange("giveBack", value)}
            required
          />
          
          {/* Buttons to navigate back and forth between forms */}
          <div className="form-button-container">
            <button 
              className="form-btn form-btn-back"
              onClick={() => navigate("/Overview")}
            >Back</button>
            <button 
              className="form-btn form-btn-continue"
              onClick={() => navigate("/Demographic-Questions")}
            >Continue</button>
          </div>
        </div>
      </div>
    );
};
export default GeneralInfoForm;