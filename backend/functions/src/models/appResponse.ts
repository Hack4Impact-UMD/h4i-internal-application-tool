import { z } from "zod";

export type ApplicationStatus = "in-progress" | "submitted" | "reviewed";

export type ApplicationResponse = {
  id: string;
  app_formId: string;
  user_id: string;
  status: ApplicationStatus;
};

export const newApplicationResponseSchema = z.object({
  id: z.string().nonempty(),
  app_formId: z.string().nonempty(),
  user_id: z.string().nonempty(),
});

export type ApplicationResponseInput = z.infer<typeof newApplicationResponseSchema>;