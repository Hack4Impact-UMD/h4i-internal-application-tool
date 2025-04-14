import { z } from "zod";

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

export const reviewSchema = z.object({
    reviewerId: z.string(),
    applicationFormId: z.string(),
    applicationResponseId: z.string(),
    applicantId: z.string(),
    applicantScores: z.record(z.string(), z.number().min(0).max(10)),
    reviewerNotes: z.array(z.string()).optional(),
    reviewStatus: z.nativeEnum(ReviewStatus),
});

export const updateReviewSchema = reviewSchema.partial();
export type ApplicationReviewForm = z.infer<typeof reviewSchema>;