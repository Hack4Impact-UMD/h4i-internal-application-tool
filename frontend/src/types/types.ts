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
}

export type UserProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: PermissionRole;
};

export interface ApplicantUserProfile extends UserProfile {
    role: PermissionRole.Applicant;
    activeApplicationIds: string[];
    inactiveApplicationIds: string[];
}

export type ReviewAssignment = {
    applicantId: string, // the applicant that was assigned for review
    applicationId: string // the submitted application that was assigned for review
}

export interface ReviewerUserProfile extends UserProfile {
    role: PermissionRole.Reviewer;
    reviewAssignments: {
        applicationReviewAssignments: ReviewAssignment[];
        interviewAssignmentIds: ReviewAssignment[];
    };
}

// stores the actual user submitted application responses
export interface ApplicationResponse {
    id: string;
    userId: string;
    applicationFormId: string;
    applicationResponseId: string;
    rolesApplied: ApplicantRole[];
    sectionResponses: SectionResponse[];
    status: ApplicationStatus;
    dateSubmitted: Timestamp;
    decisionLetterId: string;
}

// stores data about the content of the application forms
export interface ApplicationForm {
    id: string;
    title: string;
    isActive: boolean;
    dueDate: Timestamp;
    semester: string;
    description: string;
    // metadata: {};
    sections: ApplicationSection[];
}

//there should be one of this per reviewer! The id should be the same as reviewer ID
export interface ApplicationReviewData {
    id: string;
    reviewerId: string;
    applicationFormId: string;
    applicationResponseId: string;
    applicantId: string;
    applicantScores: {
        [scoreCategory in string]: number
    };
    reviewerNotes?: string[];
    reviewStatus: ReviewStatus;
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
    questions: ApplicationQuestion[];
}

export interface SectionResponse {
    sectionName: string;
    questions: QuestionResponse[];
}

export interface QuestionResponse {
    questionType: QuestionType;
    applicationFormId: string;
    questionId: string;
    response: string | string[]
}

export interface ApplicationQuestion {
    id: string;
    questionType: QuestionType;
    optional: boolean;
    questionText: string;
    secondaryText?: string;
}

export interface TextQuestion extends ApplicationQuestion {
    questionType: QuestionType.ShortAnswer | QuestionType.LongAnswer;
    placeholderText: string;
    maximumWordCount?: number;
    minimumWordCount?: number;
}

export interface OptionQuestion extends ApplicationQuestion {
    questionType: QuestionType.MultipleChoice | QuestionType.MultipleSelect;
    multipleSelect: boolean;
    questionOptions: string[];
}

export interface FileUploadQuestion extends ApplicationQuestion {
    questionType: QuestionType.FileUpload;
    fileId: string;
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
//             dueDate: new Date(2026, 1, 1, 0, 0, 0, 0),
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
//                         } as OptionQuestion
//                     ],
//                     sectionName: "Section 1"
//                 }
//             ]
//         }
//     ]
// }
//
// console.log(JSON.stringify(data))