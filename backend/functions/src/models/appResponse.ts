import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

export type ApplicationStatus = "in-progress" | "submitted" | "reviewed";

export enum QuestionType {
  ShortAnswer = 'short-answer',
  LongAnswer = 'long-answer',
  MultipleChoice = 'multiple-choice',
  MultipleSelect = 'multiple-select',
  FileUpload = 'file-upload',
}

export enum ApplicantRole {
  Bootcamp = 'bootcamp',
  Engineer = "engineer",
  Designer = "designer",
  Product = "product",
  Sourcing = "sourcing",
  TechLead = "tech-lead"
}

export interface QuestionResponse {
  applicationFormId: string;
  questionId: string;
  questionType: QuestionType;
}

export interface SectionResponse {
  sectionName: string;
  questions: QuestionResponse[];
}

export const SectionResponseSchema = z.object({
  sectionName: z.string().nonempty(),
  questions: z.array(z.object({
    applicationFormId: z.string().nonempty(),
    questionId: z.string().nonempty(),
    questionType: z.nativeEnum(QuestionType),
  })),
});

export interface ApplicationResponse {
  id: string;
  userId: string;
  applicationFormId: string;
  applicationResponseId: string;
  rolesApplied: ApplicantRole[];
  sectionResponses: SectionResponse[];
  status: ApplicationStatus;
  dateSubmitted: Timestamp;
  decisionLetterId: string;
}

export const newApplicationResponseSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
  applicationFormId: z.string().nonempty(),
  rolesApplied: z.array(z.nativeEnum(ApplicantRole)),
  sectionResponses: z.array(SectionResponseSchema),
});

export type ApplicationResponseInput = z.infer<typeof newApplicationResponseSchema>;