import { Timestamp } from "firebase/firestore";
import { ApplicantRole, QuestionType } from "./formBuilderTypes";

export * from "./formBuilderTypes";

export enum PermissionRole {
  SuperReviewer = "super-reviewer",
  Reviewer = "reviewer",
  Applicant = "applicant",
}

export enum ApplicationStatus {
  InProgress = "in-progress",
  Submitted = "submitted",
  UnderReview = "in-review",
  Interview = "interview",
  Decided = "decided",
  InActive = "inactive",
}

export enum ReviewStatus {
  NotReviewed = "not-reviewed",
  UnderReview = "under-review",
  Reviewed = "reviewed",
  Interview = "interview",
  Accepted = "accepted",
  Denied = "denied",
  Waitlisted = "waitlist",
}

export type UserProfile =
  | ApplicantUserProfile
  | ReviewerUserProfile
  | SuperReviewerUserProfile;
export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: PermissionRole;
  dateCreated: Timestamp;
}

export interface ApplicantUserProfile extends IUserProfile {
  role: PermissionRole.Applicant;
  activeApplicationIds: string[];
  inactiveApplicationIds: string[];
}

export interface ReviewerUserProfile extends IUserProfile {
  role: PermissionRole.Reviewer;
  applicantRolePreferences: ApplicantRole[]; // the roles that this reviewer prefers to review for
}

export interface SuperReviewerUserProfile extends IUserProfile {
  role: PermissionRole.SuperReviewer;
}

export type InterviewAssignment = {
  id: string;
  assignmentType: "interview";
  formId: string; // what form is this review for
  interviewerId: string;
  applicantId: string; // the applicant that was assigned for review
  applicationResponseId: string; // the submitted application that was assigned for review
  forRole: ApplicantRole;
};

export type AppReviewAssignment = {
  id: string;
  assignmentType: "review";
  formId: string; // what form is this review for
  reviewerId: string;
  applicantId: string; // the applicant that was assigned for review
  applicationResponseId: string; // the submitted application that was assigned for review
  forRole: ApplicantRole;
};

export type Assignment = AppReviewAssignment | InterviewAssignment;
// stores the actual user submitted application responses
export interface ApplicationResponse {
  id: string;
  userId: string;
  applicationFormId: string;
  rolesApplied: ApplicantRole[];
  sectionResponses: SectionResponse[];
  status: ApplicationStatus;
  dateSubmitted: Timestamp; // if not submitted, this will be the Timestamp of the last save
  decisionLetterId?: string;
}

// One of these per review. Reviews tie together an application, role, and reviewer.
export interface ApplicationReviewData {
  id: string;
  reviewerId: string;
  applicationFormId: string;
  applicationResponseId: string;
  applicantId: string;
  applicantScores: Record<string, number>;
  reviewerNotes: Record<string, string>; // reviewStatus: ReviewStatus;
  forRole: ApplicantRole; // what role is this review for
  submitted: boolean;
}

export type InternalApplicationStatus = {
  id: string;
  formId: string;
  role: ApplicantRole;
  responseId: string;
  status: ReviewStatus;
  isQualified: boolean;
};

export interface ApplicationInterviewData {
  id: string;
  interviewerId: string; // user id for the interviewer
  applicationFormId: string;
  applicationResponseId: string;
  applicantId: string;
  interviewScore: number;
  interviewNotes: string;
  forRole: ApplicantRole;
  submitted: boolean;
}

export interface SectionResponse {
  sectionId: string;
  questions: QuestionResponse[];
}

export interface QuestionResponse {
  questionType: QuestionType;
  applicationFormId: string;
  questionId: string;
  response: string | string[];
}

export type ValidationError = {
  sectionId: string;
  questionId: string;
  message: string;
};

export type RoleReviewRubric = {
  id: string;
  formId: string;
  roles: ApplicantRole[];
  rubricQuestions: ReviewRubricQuestion[];
  detailLink?: string;
  commentsDecription?: string;
};

export type ReviewRubricQuestion = {
  scoreKey: string;
  prompt: string;
  description?: string;
  maxValue?: number; // assume 4
  minValue?: number; // assume 0
};
