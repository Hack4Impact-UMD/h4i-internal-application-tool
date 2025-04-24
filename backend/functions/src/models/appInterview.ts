import { z } from "zod";

export enum InterviewStatus {
    Scheduled = "scheduled",
    Completed = "completed",
    Cancelled = "cancelled"
}

export interface InterviewData {
    id: string;
    applicationId: string;
    reviewerId: string;
    interviewDate: string;
    status: InterviewStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const interviewSchema = z.object({
    applicationId: z.string(),
    reviewerId: z.string(),
    interviewDate: z.string().datetime(),
    status: z.nativeEnum(InterviewStatus),
    notes: z.string().optional(),
});

export const updateInterviewSchema = z.object({
    interviewDate: z.string().datetime().optional(),
    status: z.nativeEnum(InterviewStatus).optional(),
    notes: z.string().optional(),
});

export interface ApplicationInterviewData {
    id: string;
    interviewerId: string; // user id for the interviewer
    applicationFormId: string;
    applicationResponseId: string;
    applicantId: string;
    interviewNotes: string;
    interviewComplete: boolean;
}
  
export const ApplicationInterviewDataSchema = z.object({
    interviewerId: z.string().nonempty(),
    applicationFormId: z.string().nonempty(),
    applicationResponseId: z.string().nonempty(),
    applicantId: z.string().nonempty(),
    interviewNotes: z.string().nonempty(),
    interviewComplete: z.boolean()
});