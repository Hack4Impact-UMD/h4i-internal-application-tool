import {
    FormProps,
    RolesData,
  } from "../../interfaces/FormData/formDataInterfaces";
import Checkbox from "../FormComponents/Checkbox";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useNavigate } from "react-router-dom";
import h4iLogo from '../../assets/h4i_logo.png';

const STORAGE_KEY = 'general_info_form_data';
  
  const ChooseRolesForm: React.FC<FormProps<RolesData>> = ({
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
            onFormDataChange(key as keyof RolesData, value);
          }
        });
      }
    );

    return (
      <div className="form-body">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Choose Role(s)</strong>
        </div>

        <div className="form-questions">
          
          <p>
            <strong>About Hack4Impact-UMD Teams & Structure</strong><br />
            At Hack4Impact-UMD, there are three types of teams: project teams, bootcamp, and the sourcing team. Project teams 
            work directly with our nonprofit partners to create products to help the community; these teams consists of Product 
            Managers (PMs), Tech Leads, Designers, and Engineers. On the other hand, bootcamp is for students who are interested 
            in Hack4Impact's mission but need experience before they join a project team. The sourcing team reaches out to 
            non-profit organizations to secure projects for Hack4Impact-UMD.
          </p>

          <p>
            <strong>Project Teams</strong><br />
            Project teams work with real non-profit partners, creating solutions for any technical needs that our partners have. 
            It's important to us when forming teams to find people who have the capacity to commit to the project for the whole 
            semester. Otherwise, it's unfair to the teams and the partners. Our project teams practice the agile software development 
            methodology, and project team members are expected to fulfill their commitments made during each sprint. Our workflow 
            involves two week sprints, weekly meetings with your team, doing your own project tasks during the week, and monthly 
            chapter wide meetings. The time commitment is around 5 hours a week.
          </p>

          <p>
            <strong>Bootcamp</strong><br />
            Bootcamp essentially teaches members the necessary skillset to join a project team. In bootcamp, students learn web 
            development skills starting from basic HTML, JavaScript, and CSS and then building up to the MERN (MongoDB, Express, 
            React, Node.js) stack. The goal is for members to complete bootcamp and then join a project team the following semester. 
            Similar to project teams, we are looking for motivated and committed students to join bootcamp and continue working with 
            our nonprofit partners. The bootcamp workflow involves weekly meetings, doing the assignments during the week, and monthly 
            chapter wide meetings. The time commitment is around 3-5 hours a week.
          </p>

          <p>
            <strong>Sourcing Team</strong><br />
            The sourcing team is responsible for reaching out to and communicating with non-profit organizations to secure projects 
            for Hack4Impact-UMD. This is an excellent opportunity for those in public policy, in business, or looking to sharpen 
            their communication skills while making an impact. As a part of the team, you will email and/or call potential nonprofits 
            and you could potentially be a part of our meetings with them. This team is vital to our organization and gives those who 
            might not be ready or interested in technical projects the opportunity to leave an impact as part of our organization. 
            The time commitment is around 3 hours a week.
          </p>

          <p>
            <strong>Member Responsibilities</strong><br />
            Regardless of which team a Hack4Impact-UMD member is in, there are responsibilities that we expect all members to follow:<br />
            - attend mandatory general body meetings<br />
            - attend team, bootcamp, or sourcing meetings<br />
            - respond to Slack messages within 24 to 48 hours<br />
            - regularly check team Slack channel and #umd-general for announcementsThere are additional responsibilities 
            depending on the member's role and team.
          </p>

          <p>
            <strong>Apply by Role</strong><br />
            You can choose which roles to apply to! Prior to each role's section in this application, there will be a question 
            gauging your interest in applying to that role. You can select "no" if you are not interested and move on to the next 
            sections of the application. You are free to apply to as many roles as you want.
          </p>
    
          <Checkbox
            heading="What roles do you want to apply for?"
            options={["Bootcamp", "Designer", "Engineer", "Product Manager (PM)", "Tech Lead", "Sourcing Team"]}
            onChange={(value, otherUnchecked) =>
                onFormDataChange("roles", [value], otherUnchecked)
            }
            choiceName="roles"
          />

          {/* Buttons to navigate back and forth between forms */}
          <div className="form-button-container">
            <button 
              className="form-btn form-btn-back"
              onClick={() => navigate("/Demographic-Questions")}
            >Back</button>
            {/* This needs to be fixed to go to the first selected role */}
            <button 
              className="form-btn form-btn-continue"
              onClick={() => navigate("/Bootcamp")}
            >Continue</button>
          </div>
        </div>
      </div>
    );
};
export default ChooseRolesForm;