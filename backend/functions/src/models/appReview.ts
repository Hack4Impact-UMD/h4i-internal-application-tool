import { z } from "zod";

export enum ReviewStatus {
  NotReviewed = 'not-reviewed',
  Reviewed = "reviewed",
  Interview = "interview",
  Accepted = "accepted",
  Denied = "denied",
  Waitlisted = "waitlist",
  // Released = "released"
}

export enum ApplicantRole {
  Bootcamp = 'bootcamp',
  Engineer = "engineer",
  Designer = "designer",
  Product = "product",
  Sourcing = "sourcing",
  TechLead = "tech-lead"
}

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

export const ApplicationReviewDataSchema = z.object({
  reviewerId: z.string().nonempty(),
  applicationFormId: z.string().nonempty(),
  applicationResponseId: z.string().nonempty(),
  applicantId: z.string().nonempty(),
  applicantScores: z.record(z.number().min(0).max(4)), // dynamic keys with number values 0-4
  reviewerNotes: z.array(z.string()).optional(),
  reviewStatus: z.nativeEnum(ReviewStatus),
  forRole: z.nativeEnum(ApplicantRole)
});

