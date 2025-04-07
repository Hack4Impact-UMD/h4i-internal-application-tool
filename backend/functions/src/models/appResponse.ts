import { z } from "zod";

export type ApplicationStatus = "in-progress" | "submitted" | "reviewed";

export type ApplicationResponse = {
  id: string;
  app_formId: string;
  user_id: string;
  status: ApplicationStatus;
};

export const applicationResponseSchema = z.object({
  id: z.string().nonempty(),
  app_formId: z.string().nonempty(),
  user_id: z.string().nonempty(),
  status: z.enum(["in-progress", "submitted", "reviewed"]),
});

export type ApplicationResponseInput = z.infer<typeof applicationResponseSchema>;