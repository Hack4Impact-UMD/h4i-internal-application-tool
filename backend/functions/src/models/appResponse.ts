import { z } from "zod";

export enum ApplicantRole {
  Bootcamp = "bootcamp",
  Engineer = "engineer",
  Designer = "designer",
  Product = "product",
  Sourcing = "sourcing",
  TechLead = "tech-lead",
}

export enum QuestionType {
  ShortAnswer = "short-answer",
  LongAnswer = "long-answer",
  MultipleChoice = "multiple-choice",
  MultipleSelect = "multiple-select",
  FileUpload = "file-upload",
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

export enum ApplicationStatus {
  InProgress = "in-progress",
  Submitted = "submitted",
  UnderReview = "in-review",
  Interview = "interview",
  Decided = "decided",
}

// stores the actual user submitted application responses
export interface ApplicationResponse {
  id: string;
  userId: string;
  applicationFormId: string;
  applicationResponseId: string;
  rolesApplied: ApplicantRole[];
  sectionResponses: SectionResponse[];
  status: ApplicationStatus;
  dateSubmitted: string;
  decisionLetterId: string;
}

export const appResponseFormSchema = z.object({
  id: z.string().nonempty("Cant have empty id"),
  rolesApplied: z
    .array(z.nativeEnum(ApplicantRole))
    .nonempty("Have to apply to atleast one role"),
  sectionResponses: z
    .array(
      z.object({
        sectionName: z.string(),
        questions: z
          .array(
            z.object({
              applicationFormId: z.string(),
              questionId: z.string(),
              questionType: z.nativeEnum(QuestionType),
              response: z.string().min(1, "Response cannot be empty"), // Ensure response is provided
            })
          )
          .nonempty("There should be at least one question per section"),
      })
    )
    .nonempty("At least one section must be provided"),
  status: z
    .nativeEnum(ApplicationStatus)
    .refine((v) => v === ApplicationStatus.InProgress, {
      message: "Application status must be in progress to submit",
    }),
});

export type AppResponseForm = z.infer<typeof appResponseFormSchema>;
