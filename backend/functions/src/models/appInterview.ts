import { z } from "zod";

export const ApplicationInterviewDataSchema = z.object({
  id: z.string().nonempty(),
  interviewerId: z.string().nonempty(),
  applicationFormId: z.string().nonempty(),
  applicationResponseId: z.string().nonempty(),
  applicantId: z.string().nonempty(),
  interviewNotes: z.string().nonempty(),
  interviewComplete: z.boolean()
});

export type ApplicationInterviewData = z.infer<typeof ApplicationInterviewDataSchema>;
