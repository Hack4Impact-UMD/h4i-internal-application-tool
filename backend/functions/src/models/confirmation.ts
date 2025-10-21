import { z } from "zod";
import { ApplicantRole } from "./appResponse";

export const DecisionLetterStatusSchema = z.object({
  status: z.enum(["accepted", "denied"]),
  userId: z.string(),
  formId: z.string(),
  responseId: z.string(),
  internalStatusId: z.string()
});

export const ConfirmationStatusSchema = z.object({
  responseId: z.string(),
  role: z.nativeEnum(ApplicantRole),
  confirmed: z.boolean(),
  timestamp: z.string().datetime(),
  userId: z.string(),
  decisionLetter: DecisionLetterStatusSchema
});

export type ConfirmationStatus = z.infer<typeof ConfirmationStatusSchema>;