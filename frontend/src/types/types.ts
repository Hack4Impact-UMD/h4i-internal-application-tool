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
}

export enum ApplicationStatus {
    InProgress = 'in-progress',
    Submitted = "submitted",
    UnderReview = "in-review",
    Interview = "interview",
    Decided = "decided",
}

export enum ReviewStatus {
    NotReviewed = 'not-reviewed',
    Reviewed = "reviewed",
    interview = "interview",
    decided = "decided",
    released = "released"
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
    activeApplications: ApplicationResponse[];
    inactiveApplications: ApplicationResponse[];
}

export interface ReviewerUserProfile extends UserProfile {
    role: PermissionRole.Reviewer;
    reviewAssignments: {
        reviewAssignmentIds: string[];
        interviewAssignmentIds: string[];
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
    dateSubmitted: string;
    decisionLetterId: string;
}

// stores data about the content of the application forms
export interface ApplicationForm {
    id: string;
    isActive: boolean;
    applicationFormId: string;
    dueDate: Date;
    semester: string;
    // metadata: {};
    sections: ApplicationSection[];
}

export interface ApplicationReviewData {
    id: string;
    applicationFormId: string;
    applicationResponseId: string;
    applicationUserId: string;
    applicantScores: { name: string, score: number };
    interviewNotes?: string;
    reviewerNotes?: string[];
    reviewStatus: ReviewStatus;
}

export interface ApplicationSection {
    sectionName: string;
    questions: ApplicationQuestion[];
}

export interface SectionResponse {
    sectionName: string;
    questions: QuestionResponse[];
}

export interface QuestionResponse {
    applicationFormId: string;
    questionId: string;
    questionType: QuestionType;
}

export interface SingleResponse extends QuestionResponse {
    questionType: QuestionType.ShortAnswer | QuestionType.LongAnswer | QuestionType.MultipleChoice;
    response: string;
}

export interface ListResponse extends QuestionResponse {
    questionType: QuestionType.MultipleSelect;
    response: string[];
}

export interface ApplicationQuestion {
    applicationFormId: string;
    questionId: string;
    questionType: QuestionType;
    optional: boolean;
    questionText: string;
    secondaryText?: string;
}

export interface TextQuestion extends ApplicationQuestion {
    questionType: QuestionType.ShortAnswer | QuestionType.LongAnswer;
    longAnswer: boolean;
    placeholderText: string;
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
