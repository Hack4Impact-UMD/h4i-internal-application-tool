import { ApplicantRole } from "../types/formBuilderTypes";
import { RoleReviewRubric } from "../types/types";

const FORM_ID = "h4i-fall-2025-form-internal";

export const APPLICATION_RUBRICS: RoleReviewRubric[] = [
  {
    id: "2025-general-rubric",
    formId: FORM_ID,
    roles: [],
    rubricQuestions: [
      {
        scoreKey: "interest-in-club",
        prompt: "Interest in the club",
        description: `1. Applicant has generic responses and puts in the bare minimum into for responses, such as one or two line answers for why they want to join.\n2. Applicant seems to have put in at least some effort into constructing a response to why they want to join, but reasons are vague and unclear.\n3. Applicant has well-written reasons for wanting to join Hack4Impact. Things preventing a 3 from a 4 could be if the applicant’s reasons could be satisfied at other clubs and not mentioning anything Hack4Impact specific.\n4. Applicant has clear and well-written reasons for wanting to join Hack4Impact specifically. Things to look for would be mentioning past projects or information from our website (showing initiative in looking up our website). If they’ve attended one of our past events, that would be a plus as well.`,
        minValue: 1,
        maxValue: 4,
      },
      {
        scoreKey: "social-good",
        prompt: "Interest in social good",
        description: `1. Applicant doesn’t mention the social impact of the club - clearly just wants to use Hack4Impact as a resume booster.\n2. Applicant mentions social impact but reasons are vague and answers to specific social initiatives seem generic and insincere.\n3. Applicant has detailed response to social initiatives and shows passion for doing social good.\n4. Applicant goes above and beyond on social initiatives that they are passionate about. Applicant shows passion about using their abilities to do good in the community, and has shown past initiative in terms of giving back to the community.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-eng-bootcamp-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.Engineer, ApplicantRole.Bootcamp],
    rubricQuestions: [
      {
        scoreKey: "technical-expertise",
        prompt: "Technical Expertise (Engineer, Bootcamp)",
        description: `1. Applicant does not have any experience with web dev or any relevant web dev projects. Applicant shows little interest in growing and learning as an engineer.\n2. Applicant has somewhat relevant experience, and shows drive and passion in learning and improving.\n3. Applicant has good relevant experience. Something stopping a 3 from a 4 would be no prior experience working on teams.\n4. Applicant has exemplary experience that would translate well to a Hack4Impact team (web dev personal projects, SWE internships). Applicant demonstrates through prior experience that they have worked proficiently on software teams (Agile) as well as exhibit great communication skills through the written application.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-tech-lead-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.TechLead],
    rubricQuestions: [
      {
        scoreKey: "technical-expertise",
        prompt: "Technical Expertise (Tech Lead)",
        description: `1. Applicant does not earn a 3 or 4 in the engineer criterion.\n2. Applicant is an above average engineer, but may need to be paired with another more experienced tech lead on a team.\n3. Applicant is an exemplary engineer and is ready to take on a larger role. Things stopping a 3 from being a 4 is a lack of in-field experience leading a SWE team.\n4. Applicant has shown exemplary ability in writing and maintaining clean code (through GitHub or previous experience). Applicant has excelled at a similar leadership role on a SWE team previously. Applicant demonstrates understanding of what good code is like and has shown to be able to make good technical decisions on what technical stack to choose.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-designer-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.Designer],
    rubricQuestions: [
      {
        scoreKey: "technical-expertise",
        prompt: "Technical Expertise (Designers)",
        description: `1. Applicant demonstrates no projects to back up their artistic ability.\n2. Applicant has adequate ability in terms of creating and designing, but designs are not outstanding.\n3. Applicant is creative and has some artistic ability. Things separating a 3 from a 4 would be lack of experience in digital design or lack of clear communication in written responses.\n4. Applicant is creative and has great artistic ability (exemplified through projects / portfolios). Applicant is a great fit, having prior experience using Figma or other Figma-esque tools.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-pm-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.Product],
    rubricQuestions: [
      {
        scoreKey: "technical-expertise",
        prompt: "Technical Expertise (PMs)",
        description: `1. Applicant does not show that they understand the scope and responsibility of the role of a PM through their responses.\n2. Applicant shows moderate ability in organization and communication - would be able to be a PM only if paired with a more experienced co-PM.\n3. Applicant shows good ability in organization and communication. Things stopping a three from a four could be inexperience with working on a rigorous software development team.\n4. Applicant clearly understands what is needed from a PM, has exemplary communication skills and has proven to be able to work proficiently in software team environments.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-pr-o-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.OutreachCoord, ApplicantRole.SocialMedia],
    rubricQuestions: [
      {
        scoreKey: "comm-and-writing-skills",
        prompt: "Communication & Writing Skills (PR & O)",
        description: `1. Applicant does not demonstrate the necessary writing and/or communication skills required for a professional setting.\n2. Applicant possesses coherent but non-professional writing skills and/or struggles with communicating openly and effectively.\n3. Applicant makes clear and sound statements/arguments throughout their writing and within their communication. They lack charisma and personality within their communication.\n4. Applicant consistently sounds professional throughout their writing and communication. Maintains a professional level of charisma within their communication.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-outreach-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.OutreachCoord],
    rubricQuestions: [
      {
        scoreKey: "npo-expertise",
        prompt: "NPO Experience (PR & O — Outreach Coordinator ONLY)",
        description: `1. Applicant does not show that they understand the scope and responsibility of the role of an NPO through their responses.\n2. Applicant has an adequate understanding of NPOs and their function within our society. They have a minimal amount of experience with NPOs.\n3. Applicant has an adequate understanding of NPOs and how they incorporate into Hack4Impacts mission. They have substantial knowledge and experience with NPOs. Little to no hands-on experience with NPOs in their personal lives.\n4. Applicant has an exceptional understanding of NPOs and how they can work in unison with Hack4Impact and our goals. They have a complete understanding of NPOs on all-levels and varied hands-on experience with them in their personal lives.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-social-media-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.SocialMedia],
    rubricQuestions: [
      {
        scoreKey: "marketing-expertise",
        prompt: "Marketing Expertise (PR & O — Social Media Manager ONLY)",
        description: `1. Applicant has no relevant experience with social media or content creation and provides no clear understanding of the platforms or goals of social media for a club/org.\n2. Applicant has limited experience with social media or content creation. They may have helped run accounts or contributed to posts but do not explain their role clearly.\n3. Applicant has relevant experience managing social media or content for a club/org. They provide some explanation of platforms used and content type.\n4. Applicant has strong, hands-on experience creating and managing social media or video content. They show clear understanding of audience engagement, platform strategy, or brand storytelling.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
  {
    id: "2025-tech-assessment-rubric",
    formId: FORM_ID,
    roles: [ApplicantRole.Engineer, ApplicantRole.TechLead],
    rubricQuestions: [
      {
        scoreKey: "tech-assessment-functionality",
        prompt: "Functionality",
        description: `1. The code barely functions. Clicking buttons doesn’t do anything.\n2. The code somewhat functions. There may be large errors, such as all artists display at once, but there is some level of functionality.\n3. It is mostly functional with a 1-2 minor errors (usually the artists do not cycle properly).\n4. Code is fully functional. The buttons do what they are supposed to. The artists cycle properly when the buttons clicked. If the cursor is not a pointer when the button is hovered, give a 3.5.`,
        minValue: 1,
        maxValue: 4,
      },
      {
        scoreKey: "tech-assessment-visual",
        prompt: "Visual",
        description: `1. The design is not reflected in the submission. Elements are missing or completely different from the design.\n2. The page looks somewhat like the Figma. Major discrepancies exist in the design, but all features are displayed. Elements may be incorrectly aligned or sized. The key difference between a 2 and a 3 is that a 2 demonstrates that there was a large visual error that was clearly not addressed (such as the arrows being just lines instead of 2D).\n3. Different from the Figma in minor ways (e.g. corners not rounded, colors off). Objects are still oriented correctly on the page. Sizing and spacing should roughly match the Figma. A 3 usually indicates a minor spacing or margin errors, rather than any major error. A 3 can also be given if the components are different sizes for different artists.\n4. Looks almost identical to the Figma design. Colors are correct. Hover interactions and selected buttons look correct. Images are correctly sized. If the sizing is a bit big, and the page has a scrollbar it can still be given a 4 (if the sizing is comically big, maybe put it as a 3. If the top or bottom of the page has no margins, then give a 3.5.`,
        minValue: 1,
        maxValue: 4,
      },
      {
        scoreKey: "tech-assessment-coding-practices",
        prompt: "Coding Practices",
        description: `1. The code is full of bad practices. Lots of hard coding. Solutions are comically overcomplicated.\n2. Values or data are hard coded. Solutions do not take advantage of key React features like state and components. Things to Look Out For: Frequent in-line styling for style that does not change. Frequent use of “position: absolute”.\n3. The code is effective but could be more efficient. Solutions are more complicated than necessary. Code is repeated when not necessary (such as in the CSS for hovering an element). Things that Could Indicate 3: - No usage of props - 1-2 instances of position: absolute - 1-2 instances of in-line styling\n4. The code is minimal to accomplish the required functionality. React states and parameters are used effectively to store and pass down information. The data is handled responsively so that if the data files were to be altered the code would still work perfectly. Things to Look For: - Usage of .map when displaying an artist’s songs - Usage of the modulus operator to cycle between artists. If either of those things are missing, give it a 3.5 instead of a 4.`,
        minValue: 1,
        maxValue: 4,
      },
      {
        scoreKey: "tech-assessment-coding-style",
        prompt: "Coding Style",
        description: `1. The code cannot be understood.\n2. The code is hard to read. There might be weird chains of parentheses or brackets. The class names don’t really make sense.\n3. The code is mostly easy to read. There might be some really long lines or some weird class names, but it’s good for the most part. Things that Could Indicate a 3: - There might be components only containing a few lines (shouldn’t really be a component). - On the other hand, there might not be enough components. Maybe one file is really big and contains too much code to the point where it affects the readability of the code. - There might be some functions which don’t need to be separate functions (such as a function whose only purpose is to setState). - A few bad class names\n4. The code is easy to read. There is good documentation and comments when appropriate. The class names are chosen well. If only a couple class names are chosen badly, give it a 3.5 or 3 depending on how many class names are bad.`,
        minValue: 1,
        maxValue: 4,
      },
    ],
  },
];
