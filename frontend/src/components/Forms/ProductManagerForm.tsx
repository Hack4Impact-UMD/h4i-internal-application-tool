import {
  FormProps,
  ProductManagerData,
} from "../../interfaces/FormData/formDataInterfaces";
import Radiobox from "../FormComponents/Radiobox";
import TextAnswer from "../FormComponents/TextAnswer";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'product_manager_form_data'; 

const ProductManagerForm: React.FC<FormProps<ProductManagerData>> = ({
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
            onFormDataChange(key as keyof ProductManagerData, value);
          }
        });
      }
    );

  return (
    <div className="form-body">
      <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Project Team Questions: Product Manager (PM)</strong>
        </div>

        <div className="form-questions">
          <p>
            Project Teams work with real non-profit partners, creating solutions for any technical needs that our partners have. 
            It's important to us when forming teams to find people who have the capacity to commit to the project for the whole 
            semester. Otherwise, it's unfair to the teams and the partners. Our project teams practice the agile software development 
            methodology, and project team members are expected to fulfill their commitments made during each sprint. Our workflow 
            involves two week sprints, weekly meetings with your team, doing your own project tasks during the week, and monthly 
            chapter-wide meetings. The time commitment is at least 3-5 hours a week.<br />
          </p>
          <p>Product Manager (PM) Responsibilities:</p>
          <p className="form-responsibilities-list">
            - responsible for drawing out the roadmap for their project<br />
            - ensures that all deadlines are met<br />
            - meets with team on a weekly basis<br />
            - meets with nonprofits on a weekly basis<br />
            - meets with tech leads and designers on a weekly basis<br />
            - meets with Director of Product weekly to discuss project progression<br />
            - be organized in terms of project management<br />
            - be accountable for any decisions made for the project<br />
            - provide accurate details of project progression<br />
            - communicate with nonprofit professionally<br />
            - be an effective communicator within the team and maintain structure<br />
            - promote participation among team members<br />
            - stimulate interaction between team members<br />
            - have effective conflict resolution skills<br />
          </p>

        <TextAnswer
          heading="Tell us about a time you led a team and how you delegated work amongst your team?"
          subHeading="Please limit your response to 500 words."
          value={sectionFormData.ledAndDelegate}
          onChange={(value) => onFormDataChange("ledAndDelegate", value)}
          required
        />

        <TextAnswer
          heading="Why do you want to become a PM at Hack4Impact-UMD and why are you a strong fit for this role?"
          subHeading="Please limit your response to 500 words."
          value={sectionFormData.whyPM}
          onChange={(value) => onFormDataChange("whyPM", value)}
          required
        />

        <TextAnswer
          heading="How do you recognize that a project is off-track and what would you do to address it?"
          value={sectionFormData.offTrack}
          onChange={(value) => onFormDataChange("offTrack", value)}
          required
        />

        <TextAnswer
          heading="How do you manage unmotivated team members or team members who are not working to their full potential?"
          subHeading="Please limit your response to a short paragraph (250 words)."
          value={sectionFormData.unmotivatedTeam}
          onChange={(value) => onFormDataChange("unmotivatedTeam", value)}
          required
        />

        <TextAnswer
          heading="Tell us about a time you couldn't meet a goal or deadline and how you dealt with/learned from it."
          value={sectionFormData.failedDeadline}
          onChange={(value) => onFormDataChange("failedDeadline", value)}
          required
        />

        <TextAnswer
          heading="Respond to the following scenario: 2 weeks out from the project deadline, the client reaches out and proposes several new features that were not previously discussed, how do you handle this situation?"
          value={sectionFormData.scenario}
          onChange={(value) => onFormDataChange("scenario", value)}
          required
        />

        <Radiobox
          heading="Are you familiar with using Notion"
          options={["Yes", "No"]}
          value={sectionFormData.useNotion}
          onChange={(value) => onFormDataChange("useNotion", value)}
          choiceName="notion"
          required
        />

        {/* Buttons to navigate back and forth between forms */}
        <div className="form-button-container">
          {/* This needs to be fixed to go to either choose roles or the previous selected role */}
          <button 
            className="form-btn form-btn-back"
            onClick={() => navigate("/Sourcing")}
          >Back</button>
          {/* This needs to be fixed to go to either submit or the next selected role */}
          <button 
            className="form-btn form-btn-continue"
            onClick={() => navigate("/UX-Design")}
          >Continue</button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagerForm;