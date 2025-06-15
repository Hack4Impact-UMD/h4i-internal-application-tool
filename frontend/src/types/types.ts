import { Timestamp } from "firebase/firestore";

export enum PermissionRole {
    SuperReviewer = "super-reviewer",
    Reviewer = "reviewer",
    Applicant = "applicant"
}

export enum ApplicantRole {
    Bootcamp = 'bootcamp',
    Engineer = "engineer",
    Designer = "designer",
    Product = "product",
    Sourcing = "sourcing",
    TechLead = "tech-lead"
}

export enum ApplicationStatus {
    InProgress = 'in-progress',
    Submitted = "submitted",
    UnderReview = "in-review",
    Interview = "interview",
    Decided = "decided",
    InActive = "inactive"
}

export enum ReviewStatus {
    NotReviewed = 'not-reviewed',
    Reviewed = "reviewed",
    Interview = "interview",
    Accepted = "accepted",
    Denied = "denied",
    Waitlisted = "waitlist",
    // Released = "released"
}

export enum QuestionType {
    ShortAnswer = 'short-answer',
    LongAnswer = 'long-answer',
    MultipleChoice = 'multiple-choice',
    MultipleSelect = 'multiple-select',
    FileUpload = 'file-upload',
    RoleSelect = "role-select"
}


export type UserProfile = ApplicantUserProfile | ReviewerUserProfile
export interface IUserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: PermissionRole;
    dateCreated: Timestamp;
};

export interface ApplicantUserProfile extends IUserProfile {
    role: PermissionRole.Applicant;
    activeApplicationIds: string[];
    inactiveApplicationIds: string[];
}

export interface ReviewerUserProfile extends IUserProfile {
    role: PermissionRole.Reviewer;
    applicantRolePreferences: ApplicantRole[]; // the roles that this reviewer prefers to review for
}


export type InterviewAssignment = {
    id: string;
    assignmentType: "interview",
    formId: string, // what form is this review for
    interviewerId: string,
    applicantId: string, // the applicant that was assigned for review
    applicationResponseId: string // the submitted application that was assigned for review
}

export type AppReviewAssignment = {
    id: string;
    assignmentType: "review",
    formId: string, // what form is this review for
    reviewerId: string,
    applicantId: string, // the applicant that was assigned for review
    applicationResponseId: string // the submitted application that was assigned for review
    forRole: ApplicantRole
}

export type ReviewerAssignment = AppReviewAssignment | InterviewAssignment
// stores the actual user submitted application responses
export interface ApplicationResponse {
    id: string;
    userId: string;
    applicationFormId: string;
    rolesApplied: ApplicantRole[];
    sectionResponses: SectionResponse[];
    status: ApplicationStatus;
    dateSubmitted: Timestamp;
    decisionLetterId?: string;
}

// stores data about the content of the application forms
export interface ApplicationForm {
    id: string;
    isActive: boolean;
    dueDate: Timestamp;
    semester: string;
    description: string;
    // metadata: {};
    sections: ApplicationSection[];
    reviewerRubric: RubricQuestion[];
}

export interface RubricQuestion {
    id: string;
    name: string; // just a way to refer to the question, i.e. "social-good"
    type: QuestionType.MultipleChoice | QuestionType.LongAnswer;
    prompt: string;
    roles: ApplicantRole[]; // put down every role if applies to all applicants
}

export interface RubricScoreQuestion extends RubricQuestion {
    type: QuestionType.MultipleChoice;
    options: string[];
}

export interface RubricTextQuestion extends RubricQuestion {
    type: QuestionType.LongAnswer;
}

// One of these per review. Reviews tie together an application, role, and reviewer.
export interface ApplicationReviewData {
    id: string;
    reviewerId: string;
    applicationFormId: string;
    applicationResponseId: string;
    applicantId: string;
    applicantScores: {
        [scoreCategory in string]: number // between 0-4, each review category in the rubric will have a value here
    };
    reviewerNotes: string;
    reviewStatus: ReviewStatus;
    forRole: ApplicantRole; // what role is this review for
}

export interface ApplicationInterviewData {
    id: string;
    interviewerId: string; // user id for the interviewer
    applicationFormId: string;
    applicationResponseId: string;
    applicantId: string;
    interviewNotes: string;
    interviewComplete: boolean;
}

export interface ApplicationSection {
    sectionId: string, //no spaces, alphanumeric, unique (used as a route param)
    sectionName: string;
    forRoles?: ApplicantRole[]; // some sections are role specific
    questions: ApplicationQuestion[];
}

export interface SectionResponse {
    sectionId: string;
    questions: QuestionResponse[];
}

export interface QuestionResponse {
    questionType: QuestionType;
    applicationFormId: string;
    questionId: string;
    response: string | string[]
}

export interface IApplicationQuestion {
    questionId: string;
    questionType: QuestionType;
    optional: boolean;
    questionText: string;
    secondaryText?: string;
}

export interface TextQuestion extends IApplicationQuestion {
    questionType: QuestionType.ShortAnswer | QuestionType.LongAnswer;
    placeholderText: string;
    maximumWordCount?: number;
    minimumWordCount?: number;
}

export interface OptionQuestion extends IApplicationQuestion {
    questionType: QuestionType.MultipleChoice | QuestionType.MultipleSelect;
    multipleSelect: boolean;
    questionOptions: string[];
}

export interface FileUploadQuestion extends IApplicationQuestion {
    questionType: QuestionType.FileUpload;
    fileId: string;
}

export interface RoleSelectQuestion extends IApplicationQuestion {
    questionType: QuestionType.RoleSelect,
    roleSections: {
        [role in ApplicantRole]: string //map a role to it's form section, used to decide which sections to display
    }
}

//helps with automatic type inference based on the questionType field
export type ApplicationQuestion = TextQuestion | OptionQuestion | FileUploadQuestion | RoleSelectQuestion

export type ValidationError = {
    sectionId: string
    questionId: string,
    message: string
}

// type MockData = {
//     applicationForms: [ApplicationForm]
// }
//
//
// const data: MockData = {
//     applicationForms: [
//         {
//             id: "",
//             description: "A sample form for testing",
//             dueDate: Timestamp.now(),
//             isActive: true,
//             semester: "Fall 2025",
//             sections: [
//                 {
//                     questions: [
//                         {
//                             questionType: QuestionType.ShortAnswer,
//                             optional: false,
//                             questionId: "q1",
//                             questionText: "A simple question",
//                             secondaryText: "Secondary text...",
//                         } as TextQuestion,
//                         {
//                             questionType: QuestionType.LongAnswer,
//                             optional: true,
//                             questionId: "q2",
//                             questionText: "Another simple question",
//                             placeholderText: "foo",
//                             minimumWordCount: 100,
//                             maximumWordCount: 500,
//                         } as TextQuestion,
//                         {
//                             multipleSelect: true,
//                             optional: false,
//                             questionId: "q3",
//                             questionText: "Multiple Selection",
//                             questionOptions: ["Option 1", "Option 2", "Option 3"],
//                             questionType: QuestionType.MultipleSelect,
//                             secondaryText: "Some secondary text..."
//                         } as OptionQuestion,
//                         {
//                             questionId: "q4",
//                             optional: false,
//                             questionText: "Select a role",
//                             roleSections: {
//                                 "bootcamp": "role-bc",
//                                 "sourcing": "role-source",
//                                 "tech-lead": "role-tl",
//                                 "engineer": "role-engineer",
//                                 "designer": "role-design",
//                                 "product": "role-product"
//                             }
//                         } as RoleSelectQuestion
//                     ],
//                     sectionName: "Section 1",
//                     sectionId: "section-1"
//                 },
//                 {
//                     sectionId: "role-bc",
//                     sectionName: "Bootcamp Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Bootcamp]
//                 },
//                 {
//                     sectionId: "role-source",
//                     sectionName: "Sourcing Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Sourcing]
//                 },
//                 {
//                     sectionId: "role-tl",
//                     sectionName: "Tech Lead Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.TechLead]
//                 },
//                 {
//                     sectionId: "role-engineer",
//                     sectionName: "Engineer Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Engineer]
//                 },
//                 {
//                     sectionId: "role-design",
//                     sectionName: "Design Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Designer]
//                 },
//                 {
//                     sectionId: "role-product",
//                     sectionName: "Product Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Product]
//                 },
//             ]
//         }
//     ]
// }
//
// console.log(JSON.stringify(data))
