import {
  ApplicationForm,
  ApplicantRole,
  QuestionType,
} from "@/types/formBuilderTypes";
import { Timestamp } from "firebase/firestore";

const FORM_ID = "h4i-fall-2025-form";

export const h4iApplicationForm: ApplicationForm = {
  id: FORM_ID,
  isActive: true,
  dueDate: Timestamp.fromDate(new Date("2025-08-20T03:59:59Z")),
  semester: "Fall 2025",
  description:
    "Hack4Impact-UMD Application Portal - Join our mission to create technology for social good!",
  decisionsReleased: false,
  scoreWeights: {
    [ApplicantRole.Bootcamp]: {
      "Interest in the club": 0.5,
      "Interest in Social Good": 0.5,
      "Technical Expertise": 0, // noted but not weighted
    },
    [ApplicantRole.Engineer]: {
      "Technical Expertise": 0.5,
      "Interest in the club": 0.25,
      "Interest in Social Good": 0.25,
    },
    [ApplicantRole.Designer]: {
      "Technical Expertise": 0.5,
      "Interest in the club": 0.25,
      "Interest in Social Good": 0.25,
    },
    [ApplicantRole.Product]: {
      "Technical Expertise": 0.5,
      "Interest in the club": 0.25,
      "Interest in Social Good": 0.25,
    },
    [ApplicantRole.TechLead]: {
      "Technical Expertise": 0.5,
      "Interest in the club": 0.25,
      "Interest in Social Good": 0.25,
    },
    [ApplicantRole.SocialMedia]: {
      "Interest in the club": 0.3,
      "Interest in Social Good": 0.3,
      "Marketing Expertise": 0.3,
      "Communication & Writing Skills": 0.1,
    },
    [ApplicantRole.OutreachCoord]: {
      "Interest in the club": 0.3,
      "Interest in Social Good": 0.3,
      "NPO Expertise": 0.3,
      "Communication & Writing Skills": 0.1,
    },
  },
  sections: [
    {
      sectionId: "basic-info",
      sectionName: "Basic Information",
      description: "Tell us about yourself",
      questions: [
        {
          questionId: "full-name",
          questionType: QuestionType.ShortAnswer,
          optional: false,
          questionText: "Full Name",
          placeholderText: "Enter your full name",
        },
        {
          questionId: "preferred-name",
          questionType: QuestionType.ShortAnswer,
          optional: true,
          questionText: "Preferred Name",
          placeholderText: "What would you like to be called?",
        },
        {
          questionId: "year",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText: "Year",
          multipleSelect: false,
          questionOptions: [
            "Freshman",
            "Sophomore",
            "Junior",
            "Senior",
            "Graduate Student",
          ],
        },
        {
          questionId: "major",
          questionType: QuestionType.ShortAnswer,
          optional: false,
          questionText: "Major",
          placeholderText: "Your major(s)",
        },
        {
          questionId: "minor",
          questionType: QuestionType.ShortAnswer,
          optional: true,
          questionText: "Minor(s)",
          placeholderText: "Your minor(s) if any",
        },
        {
          questionId: "cs-classes",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "Which CS classes have you taken?",
          secondaryText:
            "Include course numbers and names (e.g., CMSC131, CMSC132, etc.)",
          placeholderText: "List the computer science courses you've completed",
          maximumWordCount: 200,
        },
      ],
    },
    {
      sectionId: "demographics",
      sectionName: "Demographic Information",
      description: "Help us understand our community",
      questions: [
        {
          questionId: "pronouns",
          questionType: QuestionType.ShortAnswer,
          optional: true,
          questionText: "Pronouns",
          placeholderText: "e.g., she/her, he/him, they/them",
        },
        {
          questionId: "gender",
          questionType: QuestionType.MultipleChoice,
          optional: true,
          questionText: "Gender",
          multipleSelect: false,
          questionOptions: [
            "Woman",
            "Man",
            "Non-binary",
            "Prefer not to answer",
            "Prefer to self-describe",
          ],
        },
        {
          questionId: "race-ethnicity",
          questionType: QuestionType.MultipleSelect,
          optional: true,
          questionText: "Racial/Ethnic Groups",
          multipleSelect: true,
          questionOptions: [
            "American Indian or Alaska Native",
            "Asian",
            "Black or African American",
            "Hispanic or Latino",
            "Native Hawaiian or Other Pacific Islander",
            "White",
            "Prefer not to answer",
            "Prefer to self-describe",
          ],
        },
      ],
    },
    {
      sectionId: "role-selection",
      sectionName: "Role Selection",
      description:
        "About Our Roles:\n\nBootcamp - Learn web development fundamentals and contribute to projects\n\nProduct Manager - Lead project planning, coordinate teams, and manage stakeholder relationships\n\nDesigner - Create user experiences and visual designs for our nonprofit partners\n\nEngineer - Build web applications using modern technologies\n\nTech Lead - Mentor engineers and lead technical decisions\n\nSocial Media Manager - Manage our online presence and create engaging content\n\nOutreach Coordinator - Source nonprofit partnerships and manage external relationships",
      questions: [
        {
          questionId: "role-select",
          questionType: QuestionType.RoleSelect,
          optional: false,
          questionText: "Which role(s) are you applying for?",
          secondaryText:
            "Select all roles you're interested in. You'll see role-specific questions based on your selections.",
        },
      ],
    },
    {
      sectionId: "general-questions",
      sectionName: "General Questions",
      description: "Questions for all applicants",
      questions: [
        {
          questionId: "technical-skills",
          questionType: QuestionType.MultipleSelect,
          optional: false,
          questionText: "Technical Skills Checklist",
          secondaryText: "Select all that apply to your current skill level",
          multipleSelect: true,
          questionOptions: [
            "HTML/CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Python",
            "Java",
            "C++",
            "Git/GitHub",
            "SQL/Databases",
            "UI/UX Design",
            "Figma",
            "Adobe Creative Suite",
            "Project Management",
            "None of the above",
          ],
        },
        {
          questionId: "resume",
          questionType: QuestionType.FileUpload,
          optional: false,
          questionText: "Resume Upload",
          secondaryText: "Upload your current resume (PDF format preferred)",
          fileId: "resume",
        },
        {
          questionId: "why-h4i",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What about Hack4Impact-UMD drove you to apply, and what makes us stand out to you?",
          placeholderText: "Tell us what attracted you to our organization...",
          maximumWordCount: 300,
        },
        {
          questionId: "social-initiative",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Tell us about a social initiative you're interested in. How would you use your technical abilities to help?",
          placeholderText:
            "Describe a cause you care about and how technology could make a difference...",
          maximumWordCount: 300,
        },
        {
          questionId: "community-giveback",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "How have you given back to the community recently?",
          placeholderText:
            "Share your volunteer work, community involvement, or other ways you've helped others...",
          maximumWordCount: 250,
        },
        {
          questionId: "other-commitments",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "List your other commitments this semester with approximate weekly hours.",
          secondaryText: "Include: classes, work, clubs, internships, etc.",
          placeholderText:
            "Example: CMSC132 (6hrs), Part-time job (15hrs), Tennis club (3hrs)...",
          maximumWordCount: 200,
        },
        {
          questionId: "time-management",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "How do you plan to manage your time and stay consistently involved with Hack4Impact-UMD?",
          secondaryText: "Time commitment: ~5 hours per week",
          placeholderText:
            "Describe your strategy for balancing H4I with your other commitments...",
          maximumWordCount: 250,
        },
        {
          questionId: "how-did-you-hear",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText: "How did you hear about us?",
          multipleSelect: false,
          questionOptions: [
            "Friend/Word of mouth",
            "Social media",
            "Terplink",
            "Career fair",
            "Class announcement",
            "Professor recommendation",
            "Other",
          ],
        },
        {
          questionId: "other-skills",
          questionType: QuestionType.LongAnswer,
          optional: true,
          questionText: "What other cool skills do you have?",
          secondaryText:
            "*Examples:* photography, video editing, social media, marketing, nonprofit sourcing, teaching, etc.",
          placeholderText:
            "Tell us about any other talents or skills you'd bring to the team...",
          maximumWordCount: 200,
        },
      ],
    },
    {
      sectionId: "bootcamp-questions",
      sectionName: "Bootcamp Questions",
      forRoles: [ApplicantRole.Bootcamp],
      questions: [
        {
          questionId: "bootcamp-interest",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Tell us why you are interested in joining the bootcamp.",
          placeholderText:
            "What motivates you to learn web development with us?",
          maximumWordCount: 250,
        },
        {
          questionId: "learning-new-skill",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Tell us about a time you had to learn a new skill to accomplish a task.",
          placeholderText:
            "Describe the situation, what you learned, and how you approached it...",
          maximumWordCount: 300,
        },
        {
          questionId: "persistence-challenge",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Describe a time when you had to persist through a significant challenge. How did you approach it and what did you learn from that experience?",
          placeholderText:
            "Share a specific example of overcoming difficulty...",
          maximumWordCount: 300,
        },
        {
          questionId: "project-teams-interest",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText:
            "Are you interested in applying for project teams this semester?",
          multipleSelect: false,
          questionOptions: ["Yes", "No", "Maybe - depends on my progress"],
        },
      ],
    },
    {
      sectionId: "pm-questions",
      sectionName: "Product Manager Questions",
      forRoles: [ApplicantRole.Product],
      questions: [
        {
          questionId: "why-pm",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "Why do you want to become a PM at Hack4Impact-UMD?",
          placeholderText: "What attracts you to product management?",
          maximumWordCount: 300,
        },
        {
          questionId: "pm-experiences",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What experiences, in or out of the classroom, do you have that make you a strong fit for this role?",
          placeholderText:
            "Highlight relevant leadership, project management, or organizational experience...",
          maximumWordCount: 400,
        },
        {
          questionId: "leadership-style",
          questionType: QuestionType.ShortAnswer,
          optional: false,
          questionText:
            "How would you describe your leadership style? (In 50 words or less)",
          placeholderText: "Be concise and specific...",
          maximumWordCount: 50,
        },
        {
          questionId: "communication-style",
          questionType: QuestionType.ShortAnswer,
          optional: false,
          questionText:
            "How would you describe your communication style? (In 50 words or less)",
          placeholderText: "How do you interact with teammates?",
          maximumWordCount: 50,
        },
        {
          questionId: "missed-deadline",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Tell us about a time you couldn't meet a goal or deadline and how you dealt with/learned from it.",
          placeholderText:
            "Focus on what you learned and how you've improved...",
          maximumWordCount: 300,
        },
        {
          questionId: "self-taught",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Tell us about a time you taught yourself something. What was it, and how did you do it?",
          placeholderText:
            "Describe your learning process and what you accomplished...",
          maximumWordCount: 250,
        },
        {
          questionId: "ideal-project",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "What's your ideal project?",
          placeholderText:
            "Describe the type of project that excites you most...",
          maximumWordCount: 200,
        },
        {
          questionId: "notion-proficiency",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText: "Rate your proficiency with Notion",
          multipleSelect: false,
          questionOptions: [
            "1 - Unfamiliar",
            "2 - Basic knowledge",
            "3 - Comfortable",
            "4 - Proficient",
            "5 - Use frequently",
          ],
        },
        {
          questionId: "agile-proficiency",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText: "Rate your proficiency with Agile",
          multipleSelect: false,
          questionOptions: [
            "1 - Unfamiliar",
            "2 - Basic knowledge",
            "3 - Comfortable",
            "4 - Proficient",
            "5 - Use frequently",
          ],
        },
        {
          questionId: "kanban-proficiency",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText: "Rate your proficiency with kanban boards",
          multipleSelect: false,
          questionOptions: [
            "1 - Unfamiliar",
            "2 - Basic knowledge",
            "3 - Comfortable",
            "4 - Proficient",
            "5 - Use frequently",
          ],
        },
      ],
    },
    {
      sectionId: "design-questions",
      sectionName: "Designer Questions",
      forRoles: [ApplicantRole.Designer],
      questions: [
        {
          questionId: "why-designer",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Why are you interested in becoming a designer at Hack4Impact-UMD, and why do you think you're a good fit?",
          placeholderText: "What draws you to design and our mission?",
          maximumWordCount: 300,
        },
        {
          questionId: "figma-experience",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What's your experience with Figma (or other design tools)?",
          placeholderText:
            "Describe your familiarity with design software and tools...",
          maximumWordCount: 200,
        },
        {
          questionId: "collaboration-feedback",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Describe how you collaborate with teammates in different roles, such as designers and engineers. How do you typically respond to feedback, and how do you approach resolving disagreements within a team?",
          placeholderText:
            "Share your approach to teamwork and handling feedback...",
          maximumWordCount: 350,
        },
        {
          questionId: "portfolio",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "Portfolio Submission (mandatory)",
          secondaryText:
            "Please include links to your work:\n- Portfolio website\n- Behance/Dribbble\n- Specific project links\n- GitHub repositories",
          placeholderText: "Provide links to your design work...",
          maximumWordCount: 300,
        },
        {
          questionId: "additional-info-design",
          questionType: QuestionType.LongAnswer,
          optional: true,
          questionText:
            "Is there anything else you'd like to share with us that you think is important for your application?",
          placeholderText:
            "Any additional context about your design background or interests...",
          maximumWordCount: 250,
        },
      ],
    },
    {
      sectionId: "general-engineering",
      sectionName: "General Engineering Questions",
      forRoles: [ApplicantRole.Engineer, ApplicantRole.TechLead],
      questions: [
        {
          questionId: "why-engineering",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Why engineering at Hack4Impact-UMD? What interests you about an engineering role at Hack4Impact-UMD?",
          placeholderText:
            "What excites you about building technology for social good?",
          maximumWordCount: 300,
        },
        {
          questionId: "engineering-journey",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Describe your engineering journey thus far. What got you into engineering? What excites you about building technology?",
          placeholderText:
            "Tell us your story with technology and what drives your passion...",
          maximumWordCount: 350,
        },
        {
          questionId: "git-experience",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What is your experience with Git and Github? If you used it in a collaborative setting, tell us about how you managed pull requests or worked in a shared codebase.",
          placeholderText:
            "Describe your version control experience and any team projects...",
          maximumWordCount: 250,
        },
        {
          questionId: "tech-stack",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "List the languages, frameworks, or tools you're most familiar with (e.g., React, Node, Django, etc.) and provide a short description of how you've used each.",
          placeholderText:
            "For each technology, briefly explain a project or context where you used it...",
          maximumWordCount: 400,
        },
        {
          questionId: "team-experience",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Tell us about a time you worked on a team. What role did you play, and what did you learn from that experience?",
          placeholderText:
            "Describe a collaborative project and your contribution...",
          maximumWordCount: 300,
        },
        {
          questionId: "admired-technology",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What's a piece of technology (a product, tool, or system) you admire and why?",
          placeholderText:
            "This could be an app, framework, system architecture, etc...",
          maximumWordCount: 200,
        },
      ],
    },
    {
      sectionId: "engineer-specific",
      sectionName: "Engineer Specific Questions",
      forRoles: [ApplicantRole.Engineer],
      questions: [
        {
          questionId: "master-technology",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "If you could instantly master one technology or tool, what would it be and what would you build with it?",
          placeholderText:
            "What technology excites you most and what would you create?",
          maximumWordCount: 250,
        },
        {
          questionId: "project-management-experience",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Have you worked in teams that use sprints, standups, or project management tools like Trello, Notion, or Jira? Briefly describe your experience (if any). Note that this is not a prerequisite for this role.",
          placeholderText:
            "Any experience with agile methodologies or project management tools...",
          maximumWordCount: 200,
        },
        {
          questionId: "technical-mistake",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Describe a mistake you made on a technical project (in class, work, research, or for fun). How did you identify and resolve it?",
          placeholderText:
            "Focus on your problem-solving process and what you learned...",
          maximumWordCount: 300,
        },
      ],
    },
    {
      sectionId: "tech-lead-specific",
      sectionName: "Tech Lead Specific Questions",
      forRoles: [ApplicantRole.TechLead],
      questions: [
        {
          questionId: "tl-motivation",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What motivates you to step up into the leadership role of a Tech Lead at Hack4Impact-UMD?",
          placeholderText: "What drives you to take on technical leadership?",
          maximumWordCount: 300,
        },
        {
          questionId: "tl-fit",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What makes you a great fit for the TL role? Discuss any leadership experience, mentoring, or systems thinking examples.",
          placeholderText:
            "Highlight relevant leadership and technical experience...",
          maximumWordCount: 400,
        },
        {
          questionId: "leadership-understanding",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What's something you wish more engineering leaders understood?",
          placeholderText: "Share insights about technical leadership...",
          maximumWordCount: 250,
        },
      ],
    },
    {
      sectionId: "pr-outreach",
      sectionName: "PR & Outreach Questions",
      forRoles: [ApplicantRole.SocialMedia, ApplicantRole.OutreachCoord],
      questions: [
        {
          questionId: "role-preference",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText: "Please rank your preference for roles:",
          secondaryText: "Select your top preference",
          multipleSelect: false,
          questionOptions: [
            "Social Media Manager",
            "Outreach Coordinator",
            "Either role works for me",
          ],
        },
        {
          questionId: "preference-reasoning",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "What motivated you to rank your preferences that way?",
          placeholderText: "Explain your interest in these roles...",
          maximumWordCount: 250,
        },
        {
          questionId: "why-pr-outreach",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "What makes you want to join PR & O and why are you a strong candidate?",
          placeholderText:
            "What draws you to communications and outreach work?",
          maximumWordCount: 300,
        },
        {
          questionId: "professional-communication",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Do you have any experience communicating professionally on behalf of a club/organization, and if so, can you briefly describe what you did?",
          placeholderText:
            "Include any relevant communications, marketing, or outreach experience...",
          maximumWordCount: 250,
        },
        {
          questionId: "social-media-experience",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Do you have any experience professionally running social media or video editing on behalf of a club/organization, and if so, can you briefly describe what you did?",
          placeholderText:
            "Describe any content creation or social media management experience...",
          maximumWordCount: 250,
        },
        {
          questionId: "video-call-comfort",
          questionType: QuestionType.MultipleChoice,
          optional: false,
          questionText:
            "How comfortable are you going on video calls with a potential nonprofit organization?",
          multipleSelect: false,
          questionOptions: [
            "Very comfortable",
            "Somewhat comfortable",
            "Neutral",
            "Somewhat uncomfortable",
            "Very uncomfortable",
          ],
        },
        {
          questionId: "nonprofit-research",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText: "Nonprofit Research Assignment",
          secondaryText:
            "Find 2 nonprofits in the D.C./Maryland/Virginia area that would be good fits for projects with Hack4Impact-UMD.\n\nFor each nonprofit, provide:\n- Organization name\n- Two-sentence explanation of why they'd be a good fit",
          placeholderText:
            "Research local nonprofits that could benefit from technology solutions...",
          maximumWordCount: 400,
        },
        {
          questionId: "npo-experience",
          questionType: QuestionType.LongAnswer,
          optional: false,
          questionText:
            "Do you have any prior experience working with Nonprofit Organizations? If not, please put N/A.",
          placeholderText:
            "Describe any volunteer work or nonprofit involvement...",
          maximumWordCount: 200,
        },
      ],
    },
  ],
};
