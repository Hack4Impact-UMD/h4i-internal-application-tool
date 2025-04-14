import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './ApplicantDetails.css';
import { Applicant } from './ReviewDashboard';

const ApplicantDetails = () => {
  const { id } = useParams();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const applicantDocRef = doc(db, 'users', id as string);
        const docSnap = await getDoc(applicantDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const dateApplied = data.dateApplied ? data.dateApplied.toDate().toLocaleDateString() : null;
          const applicationScore = data.applicationScore || 0;
          const interviewScore = data.interviewScore || 0;
          const overallScore = applicationScore + interviewScore;

          setApplicant({ ...data, dateApplied, overallScore });
        } else {
          console.log('Applicant not found');
        }
      } catch (error) {
        console.error('Error fetching applicant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicant();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!resumeFile || !id) return;

    setUploading(true);
    
    try {
      // Part 1: Front-end simulation only
      // This will be replaced with actual Firebase upload in Part 2
      const fakeResumeUrl = `https://example.com/resumes/${id}/${resumeFile.name}`;
      
      // Update local state
      setApplicant(prev => prev ? { ...prev, resume: fakeResumeUrl } : null);
      
      // Show success message
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!applicant) {
    return <div>Applicant not found.</div>;
  }

  const renderGeneralRubric = () => {
    const defaultQuestions = (
      <>
        <div className="score-category">
          <div className='rubric-questions'>Interest in Club:</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`club-${score}`}>
                <input type="radio" name="interestInClub" value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Interest in Social Good:</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`social-${score}`}>
                <input type="radio" name="interestInSocialGood" value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
      </>
    );

    return (
      <div className="rubric-box">
        <div className="bigger-header">General Application Rubric</div>
        {defaultQuestions}
      </div>
    );
  };

  const renderRubric = (role) => {
    const roleNames = {
      'Er': 'Engineer',
      'TL': 'Tech Lead',
      'Sg': 'Sourcing',
      'Ds': 'Designer',
      'PM': 'Project Manager',
      'Bp': 'Bootcamp Program'
    };

    const roleName = roleNames[role] || role;

    const defaultQuestions = (
      <>
        <div className="score-category">
          <div className='rubric-questions'>Interest in Club:</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`club-${score}`}>
                <input type="radio" name="interestInClub" value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Interest in Social Good:</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`social-${score}`}>
                <input type="radio" name="interestInSocialGood" value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Technical Expertise:</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`technical-${score}`}>
                <input type="radio" name="technicalExpertise" value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
      </>
    );

    const engineerQuestions = (
      <>
        <div className="score-category">
          <div className='rubric-questions'>Technical Expertise:</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`technical-${score}`}>
                <input type="radio" name="technicalExpertise" value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>

      </>
    )



    const techAssessmentQuestions = (
      <>
        <div className="score-category">
          <div className='rubric-questions'>Technical Expertise</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`problem-solving-${score}`}>
                <input type="radio" name={`problem-solving-${role}`} value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Functionality</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`problem-solving-${score}`}>
                <input type="radio" name={`problem-solving-${role}`} value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Visual</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`coding-experience-${score}`}>
                <input type="radio" name={`coding-experience-${role}`} value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Coding Practices</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`coding-experience-${score}`}>
                <input type="radio" name={`coding-experience-${role}`} value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Coding Style</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`coding-experience-${score}`}>
                <input type="radio" name={`coding-experience-${role}`} value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
        <div className="score-category">
          <div className='rubric-questions'>Bonus</div>
          <div className="radio-buttons">
            {[1, 2, 3, 4].map((score) => (
              <label key={`coding-experience-${score}`}>
                <input type="radio" name={`coding-experience-${role}`} value={score} />
                {score}
              </label>
            ))}
          </div>
        </div>
      </>
    );

    return (
      <div className="rubric-box">
        <div className="bigger-header">{roleName} Application Rubric</div>
        <a href="https://www.notion.so/h4i/Application-Rubric-368daf70447f4eb58ba6c74e6b3d6989" target="_blank" className="rubric-link">Rubric Link</a>

        {roleName === 'Engineer' ? techAssessmentQuestions : defaultQuestions}
      </div>
    );
  };

  return (
    <div className="applicant-details">
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          marginLeft: '-1300px',
          marginTop: '80px',
          color: 'gray',
          cursor: 'pointer',
          fontFamily: 'Karla',
          fontSize: '16px',
        }}
      >
        ← Back to Applicants
      </Link>

      <img src="/Header.jpg" alt="Header" className="navbar-header-image" />
      <header>
        <div className="banner"></div>
      </header>

      <div className="applicant-name">{applicant.name}</div>

      <div className="applicant-details-wrapper">
        {/* General Information */}
        <div className="general-questions-box">
          <div className='bigger-header'>H4I New Member</div>
          <div className='bigger-header'>Application Spring 2025</div>
          <div className="mini-header">General Questions</div>
          <div className='question-headers'>Email</div>
          <div className='question-answers'>{applicant.email || '-'}</div>
          <div className='question-headers'>Full Name</div>
          <div className='question-answers'>{applicant.name || '-'}</div>
          <div className='question-headers'>Preferred Name</div>
          <div className='question-answers'>{applicant.preferred || '-'}</div>
          <div className='question-headers'>Year in School</div>
          <div className='question-answers'>{applicant.year || '-'}</div>
          <div className='question-headers'>Major</div>
          <div className='question-answers'>{applicant.major || '-'}</div>
          <div className='question-headers'>Minor(s)</div>
          <div className='question-answers'>{applicant.minor || '-'}</div>
          <div className='question-headers'>What CS classes have you taken?</div>
          <div className='question-answers'>
            {applicant.classes && applicant.classes.length > 0 ? (
              applicant.classes.map((cls, index) => (
                <div key={index}>{cls}</div>
              ))
            ) : (
              <p>No classes listed</p>
            )}
          </div>
          <div className='question-headers'>Technical Skills</div>
          <div className='question-answers'>
            {applicant.skills && applicant.skills.length > 0 ? (
              applicant.skills.map((cls, index) => (
                <div key={index}>{cls}</div>
              ))
            ) : (
              <p>No skills listed</p>
            )}
          </div>
          <div className='question-headers'>Aside from tech related things, do you have other cool skills? (photography, video editing, social media, marketing, nonprofit sourcing, teaching, etc.)</div>
          <div className='question-answers'>{applicant.otherskills || '-'}</div>
          <div className='question-headers'>Resume</div>
          <div className='question-answers'>
            {applicant.resume ? (
              <a href={applicant.resume} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            ) : (
              <div className="resume-upload-container">
                <input 
                  type="file" 
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <button 
                  onClick={handleUpload}
                  disabled={!resumeFile || uploading}
                  className="upload-button"
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </button>
                {uploadSuccess && <span className="upload-success">Resume uploaded successfully!</span>}
              </div>
            )}
          </div>
          <div className='question-headers'>Why do you want to join Hack4Impact-UMD?</div>
          <div className='question-answers'>{applicant.whyh4i || '-'}</div>
          <div className='question-headers'>In your opinion, what differentiates Hack4Impact-UMD from other student clubs / opportunities on campus?</div>
          <div className='question-answers'>{applicant.diffh4i || '-'}</div>
          <div className='question-headers'>How did you hear about us?</div>
          <div className='question-answers'>{applicant.hearaboutus || '-'}</div>
          <div className='question-headers'>Other commitments</div>
          <div className='question-answers'>{applicant.commitments || '-'}</div>
          <div className='question-headers'>Considering the weekly commitment is at least 5 hours, how do you plan on staying involved in Hack4Impact-UMD?</div>
          <div className='question-answers'>{applicant.stayinvolved || '-'}</div>
          <div className='question-headers'>What is a social initiative you’re interested in and how would you use your technical abilities to help?</div>
          <div className='question-answers'>{applicant.socialinitiative || '-'}</div>
          <div className='question-headers'>How have you given back to the community recently?</div>
          <div className='question-answers'>{applicant.community || '-'}</div>

          {/* demographics */}

          <div className="mini-header">Demographic Questions</div>
          <div className='question-headers'>Pronouns</div>
          <div className='question-answers'>{applicant.pronouns || '-'}</div>
          <div className='question-headers'>What gender do you identify with?</div>
          <div className='question-answers'>{applicant.gender || '-'}</div>
          <div className='question-headers'>Do you identify as transgender?</div>
          <div className='question-answers'>{applicant.trans || '-'}</div>
          <div className='question-headers'>What racial or ethnic groups do you identify as?</div>
          <div className='question-answers'>
            {applicant.ethnicgroups && applicant.ethnicgroups.length > 0 ? (
              applicant.ethnicgroups.map((cls, index) => (
                <div key={index}>{cls}</div>
              ))
            ) : (
              <p>No groups listed</p>
            )}
          </div>

          {/* questions - eng */}

          <div className="mini-header">Engineer Questions</div>
          <div className='question-headers'>Why do you want to become an Engineer at Hack4Impact-UMD?</div>
          <div className='question-answers'>{applicant.whyeng || '-'}</div>
          <div className='question-headers'>Why are you a strong fit for the Engineer role?</div>
          <div className='question-answers'>{applicant.fiteng || '-'}</div>
          <div className='question-headers'>Tell us about your experience with Git and GitHub.</div>
          <div className='question-answers'>{applicant.giteng || '-'}</div>
          <div className='question-headers'>Please talk about the different languages or frameworks (Ex. Node, React, etc.) you have experience in and give a brief description of the experience you have in each.</div>
          <div className='question-answers'>{applicant.langeng || '-'}</div>
          <div className='question-headers'>Tell us about a mistake you made while working on a coding project (in class, internship, research, or for fun). How did you handle it?</div>
          <div className='question-answers'>{applicant.mistakeeng || '-'}</div>
          <div className='question-headers'>Describe your experience working in engineering teams and/or working in sprints, if any. This is NOT a prerequisite for joining but gives us an idea of the experience level.</div>
          <div className='question-answers'>{applicant.teameng || '-'}</div>
          <div className='question-headers'>Technical Application Assessment</div>
          <div className='question-answers'>{applicant.techeng || '-'}</div>
          <div className='question-headers'>Comments/Notes</div>
          <div className='question-answers'>{applicant.commentseng || '-'}</div>

          {/* questions - bootcamp */}

          <div className="mini-header">Bootcamp Questions</div>
          <div className='question-headers'>Tell us why you are interested in joining the Bootcamp.</div>
          <div className='question-answers'>{applicant.whyboot || '-'}</div>
          <div className='question-headers'>Tell us about a time you had to learn a new skill to accomplish a task.</div>
          <div className='question-answers'>{applicant.learnboot || '-'}</div>
          <div className='question-headers'>Describe a time when you had to persist through a significant challenge. How did you approach it and what did you learn from that experience?</div>
          <div className='question-answers'>{applicant.persistboot || '-'}</div>

          {/* questions - PM */}

          <div className="mini-header">Product Manager Questions</div>
          <div className='question-headers'>Why do you want to become a PM at Hack4Impact-UMD and why are you a strong fit for this role?</div>
          <div className='question-answers'>{applicant.whypm || '-'}</div>
          <div className='question-headers'>Tell us about a time you led a team and how you delegated work amongst your team?</div>
          <div className='question-answers'>{applicant.leadpm || '-'}</div>
          <div className='question-headers'>How do you recognize that a project is off-track and what would you do to address it?</div>
          <div className='question-answers'>{applicant.offtrackpm || '-'}</div>
          <div className='question-headers'>How do you manage unmotivated team members or team members who are not working to their full potential?</div>
          <div className='question-answers'>{applicant.motivatepm || '-'}</div>
          <div className='question-headers'>Tell us about a time you couldn't meet a goal or deadline and how you dealt with/learned from it.</div>
          <div className='question-answers'>{applicant.goalpm || '-'}</div>
          <div className='question-headers'>Respond to the following scenario: 2 weeks out from the project deadline, the client reaches out and proposes several new features that were not previously discussed, how do you handle this situation?</div>
          <div className='question-answers'>{applicant.scenariopm || '-'}</div>
          <div className='question-headers'>Are you familiar with using Notion?</div>
          <div className='question-answers'>{applicant.notionpm || '-'}</div>

          {/* questions - TL */}

          <div className="mini-header">Tech Lead Questions</div>
          <div className='question-headers'>Why do you want to become a Tech Lead at Hack4Impact-UMD?</div>
          <div className='question-answers'>{applicant.whytl || '-'}</div>
          <div className='question-headers'>Why are you a strong fit for the Tech Lead role?</div>
          <div className='question-answers'>{applicant.fittl || '-'}</div>
          <div className='question-headers'>Tell us about your experience with Git and GitHub.</div>
          <div className='question-answers'>{applicant.gittl || '-'}</div>
          <div className='question-headers'>Please talk about the different languages or frameworks (Ex. Node, React, etc.) you have experience in and please give a brief description of the experience you have in each.</div>
          <div className='question-answers'>{applicant.langtl || '-'}</div>
          <div className='question-headers'>Tell us about a successful project that you led or participated in and why do you think it was successful.</div>
          <div className='question-answers'>{applicant.projtl || '-'}</div>
          <div className='question-headers'>Technical Application Assessment</div>
          <div className='question-answers'>{applicant.techtl || '-'}</div>
          <div className='question-headers'>Comments/Notes</div>
          <div className='question-answers'>{applicant.commentstl || '-'}</div>

          {/* questions - Design */}

          <div className="mini-header">Designer Questions</div>
          <div className='question-headers'>Why do you want to become a Designer at Hack4Impact-UMD?</div>
          <div className='question-answers'>{applicant.whydes || '-'}</div>
          <div className='question-headers'>Why are you a strong fit for the Designer role?</div>
          <div className='question-answers'>{applicant.fitdes || '-'}</div>
          <div className='question-headers'>Describe your design workflow.</div>
          <div className='question-answers'>{applicant.workflowdes || '-'}</div>
          <div className='question-headers'>How do you respond to negative feedback from a client/stakeholder?</div>
          <div className='question-answers'>{applicant.feedbackdes || '-'}</div>
          <div className='question-headers'>How do you collaborate with other designers and engineers? Please also discuss how you would handle conflicts within a team.</div>
          <div className='question-answers'>{applicant.collabdes || '-'}</div>
          <div className='question-headers'>Tell us about your experience using Figma. If you have not used Figma before, please tell us about your experience using other design applications.</div>
          <div className='question-answers'>{applicant.figmades || '-'}</div>
          <div className='question-headers'>How many years of design-related experience do you have?</div>
          <div className='question-answers'>{applicant.expdes || '-'}</div>
          <div className='question-headers'>Design portfolio link</div>
          <div className='question-answers'>{applicant.portfoliodes || '-'}</div>

          {/* questions - Sourcing */}

          <div className="mini-header">Sourcing Team Questions</div>
          <div className='question-headers'>Do you have any experience communicating professionally on behalf of a club/organization, and if so, can you briefly describe what you did?</div>
          <div className='question-answers'>{applicant.commsg || '-'}</div>
          <div className='question-headers'>How comfortable are you going on video calls with a potential nonprofit organization?</div>
          <div className='question-answers'>{applicant.callsg || '-'}</div>
          <div className='question-headers'>Why would you be a good sourcing team member?</div>
          <div className='question-answers'>{applicant.whysg || '-'}</div>
          <div className='question-headers'>Find 2 nonprofits in the D.C./Maryland/Virginia area that would be good fits for projects with Hack4Impact-UMD. For each nonprofit, provide a two-sentence explanation as to why you think this nonprofit would be a good fit.</div>
          <div className='question-answers'>{applicant.nposg || '-'}</div>
          <div className='question-headers'>Do you have any prior experience working with Nonprofit Organizations? If not, please put N/A.</div>
          <div className='question-answers'>{applicant.expsg || '-'}</div>


        </div>

        <div className="tech-lead-scores-box">
          {renderGeneralRubric()}
          {applicant.roles && applicant.roles.map((role, index) => (
            <div key={index}>
              {renderRubric(role)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
