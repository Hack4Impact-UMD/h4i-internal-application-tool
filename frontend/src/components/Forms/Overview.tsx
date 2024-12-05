import h4iLogo from '../../assets/h4i_logo.png';
import { useNavigate } from "react-router-dom";
  
const Overview = () => {

  const navigate = useNavigate();

    return (
      <div className="form-body">
        <img className="form-logo" src={h4iLogo} alt="H4I" />
        <div className="form-heading">
          <strong>Hack4Impact-UMD New Member Application Fall 2024</strong>
        </div>

        <div className="form-questions">
  
          <p>
            Hack4Impact is a student-run 501(c)(3) dedicated to building software for social impact. We are the University of 
            Maryland, College Park chapter of the national Hack4Impact organization. Each year, we partner with nonprofits to 
            help them better serve their communities. We are recruiting software engineers, product managers, tech leads, UI 
            designers, and sourcing team members for the fall semester.
          </p>

          <p>
            We are looking for new members who are:<br />
            - Willing to commit their time for 1 semester (at least 5 hours per week)<br />
            - Excited about our mission and values<br />
            - Passionate about software, social impact, and our nonprofit partners<br />
            - Willing to learn
          </p>

          <p>
            Extensive experience isn't necessary, but technical applicants should have programming experience. We place a strong 
            emphasis on learning, so we'll teach you everything you need to know beyond programming fundamentals during bootcamp!
          </p>

          <p>
            As a software engineer, you will:<br />
            - Develop and ship a project to a nonprofit partner<br />
            - Gain the skills necessary to become a full-stack developer<br />
            - Learn how to identify user needs in order to design the best products for the problem
          </p>

          <p>
            We also have positions open for Software Engineers, Product Managers (PMs), Tech Leads (TLs), UI/UX Designers and
            Sourcing Team members. PMs will work directly with our nonprofit partners to gather project requirements and ensure 
            what we create is the best solution for the nonprofit and communicate those needs to engineers. Tech Leads serve as 
            the point of contact for engineers, providing technical guidance as well as upholding code quality through code 
            reviews. Designers will work with both engineers and nonprofits, creating UI mockups for our projects to ensure our 
            projects go above and beyond our clients' expectations. Sourcing team members reach out to and liaise with nonprofit 
            organizations, securing projects for Hack4Impact through meetings and communication with potential partners.
          </p>

          <p>
            Why join?<br />
            - Developing projects for our nonprofit partners as a student is incredible, and recruiters notice<br />
            - You'll find a community of multidisciplinary, passionate people who love what they do<br />
            - You can learn more about a role you may want to have after school<br />
            - Attend workshops, tech talks, social events, and volunteer events<br />
            - Learn about working in the nonprofit sector and tech for social good<br />
            - Work with and learn more about some amazing organizations<br />
            - Get plugged into a strong network of accomplished and amazing alums
          </p>

          <p>
            There are also PLENTY of opportunities to gain leadership experience. We have positions for mentors, a super fun board 
            of directors, and even a national board and committees. As an organization and as a community, we care about and actively 
            support the individual development of each member, both professional and personal. When you join Hack4Impact-UMD, you 
            join a national network of leaders, techies, do-gooders, and friends.
          </p>

          <p>
            Feel free to visit our chapter website at 
            &nbsp;<a href="https://umd.hack4impact.org" target="_blank" rel="noopener noreferrer">https://umd.hack4impact.org</a>&nbsp;
            or the national website at 
            &nbsp;<a href="https://hack4impact.org" target="_blank" rel="noopener noreferrer">https://hack4impact.org</a>&nbsp;
            for more information.
          </p>

          <p>
            We will have rolling applications that consist of this written application and may include a video interview (not a 
            technical interview). Those applying for the engineer and/or tech lead role are REQUIRED to complete a technical 
            assessment (2-3 hours) included in the following sections of this application form. We will be CLOSING the form at 
            midnight (11:59pm EST) on August 13, 2024 or when openings are filled.
          </p>

          <p>
            Please do not use ChatGPT or other AI services to create or edit your responses.
          </p>

          <p>
            Please reach out to 
            &nbsp;<a href="mailto:umd@hack4impact.org">umd@hack4impact.org</a>&nbsp;
            if you have any questions.
        </p>

          <p>
            All admission decisions will be communicated to applicants no later than August 30, 2024.
          </p>
          
          {/* Button to navigate back and forth between forms */}
          <div className="form-button-container">
            <button 
              className="form-btn form-btn-continue"
              onClick={() => navigate("/General-Information")}
            >Continue</button>
          </div>
        </div>
      </div>
    );
};

export default Overview;