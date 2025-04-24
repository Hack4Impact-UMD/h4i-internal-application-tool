import { z } from "zod";
import { ApplicantRole } from "./appResponse";

export enum PermissionRole {
    SuperReviewer = "super-reviewer",
    Reviewer = "reviewer",
    Applicant = "applicant"
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

export type UserProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: PermissionRole;
};

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
    reviewerNotes?: string[];
    reviewStatus: ReviewStatus;
    forRole: ApplicantRole; // what role is this review for
}

export const reviewSchema = z.object({
    reviewerId: z.string(),
    applicationFormId: z.string(),
    applicationResponseId: z.string(),
    applicantId: z.string(),
    applicantScores: z.record(z.string(), z.number().min(0).max(10)),
    reviewerNotes: z.array(z.string()).optional(),
    reviewStatus: z.nativeEnum(ReviewStatus),
    forRole: z.nativeEnum(ApplicantRole)
});

export const updateReviewSchema = reviewSchema.partial();
export type ApplicationReviewForm = z.infer<typeof reviewSchema>;
