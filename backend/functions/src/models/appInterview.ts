import { z } from "zod";

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