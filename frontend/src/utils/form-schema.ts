import { z } from "zod";
import { ApplicantRole, QuestionType } from "@/types/formBuilderTypes";

const ApplicantRoleSchema = z.enum(ApplicantRole);
const scoreWeightSchema = z.number().min(0).max(4);
const scoreCategoryMapSchema = z.record(z.string(), scoreWeightSchema);
const scoreWeightsSchema = z.record(
  z.enum(ApplicantRole),
  scoreCategoryMapSchema,
);

const BaseQuestion = z.object({
  questionId: z.string(),
  optional: z.boolean(),
  questionText: z.string(),
  secondaryText: z.string().optional(),
});

const TextQuestion = BaseQuestion.extend({
  questionType: z.enum([QuestionType.ShortAnswer, QuestionType.LongAnswer]),
  placeholderText: z.string(),
  maximumWordCount: z.number().optional(),
  minimumWordCount: z.number().optional(),
});

const OptionQuestion = BaseQuestion.extend({
  questionType: z.enum([
    QuestionType.MultipleChoice,
    QuestionType.MultipleSelect,
  ]),
  multipleSelect: z.boolean(),
  questionOptions: z.array(z.string()),
});

const FileUploadQuestion = BaseQuestion.extend({
  questionType: z.literal(QuestionType.FileUpload),
  fileId: z.string(),
});

const RoleSelectQuestion = BaseQuestion.extend({
  questionType: z.literal(QuestionType.RoleSelect),
  roleSections: z.record(z.enum(ApplicantRole), z.string()),
});

export const ApplicationQuestionSchema = z.discriminatedUnion("questionType", [
  TextQuestion,
  OptionQuestion,
  FileUploadQuestion,
  RoleSelectQuestion,
]);

export const ApplicationSectionSchema = z.object({
  sectionName: z.string(),
  sectionId: z.string(),
  forRoles: z.array(ApplicantRoleSchema).optional(),
  questions: z.array(ApplicationQuestionSchema),
});

export const ApplicationFormSchema = z.object({
  id: z.string().nonempty(),
  isActive: z.boolean(),
  dueDate: z.date(),
  semester: z.string(),
  description: z.string(),
  disabledRoles: z.array(ApplicantRoleSchema).optional(),
  sections: z.array(ApplicationSectionSchema),
  decisionsReleased: z.boolean().default(false),
  scoreWeights: scoreWeightsSchema,
});

export type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;
