import { z } from "zod";

// specific application
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
  questionType: QuestionType;
  applicationFormId: string;
  questionId: string;
  response: string | string[]
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
  applicationFormId: z.string().nonempty("Cant have empty applicationFormId"),
  applicationResponseId: z.string().nonempty("Cant have empty id"),
  userId: z.string().nonempty("Cant have empty userId"),
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
              response: z.string(),
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

export const SectionResponseSchema = z.object({
  sectionName: z.string().nonempty(),
  questions: z.array(z.object({
    applicationFormId: z.string().nonempty(),
    questionId: z.string().nonempty(),
    questionType: z.nativeEnum(QuestionType),
  })),
});

export const newApplicationResponseSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
  applicationFormId: z.string().nonempty(),
  rolesApplied: z.array(z.nativeEnum(ApplicantRole)),
  sectionResponses: z.array(SectionResponseSchema),
});

export type ApplicationResponseInput = z.infer<typeof newApplicationResponseSchema>;
