import { z } from "zod";

export const ApplicationQuestion = z.object({
  questionId: z.string().nonempty(),
  questionType: z.string().nonempty(),
  optional: z.boolean(),
  questionText: z.string(),
  secondaryText: z.string().optional(),
  minimumWordCount: z.number().optional(),
  maximumWordCount: z.number().optional(),
})

export const ApplicationSectionSchema = z.object({
  sectionName: z.string(),
  questions: z.array(ApplicationQuestion)
})


export const ApplicationFormSchema = z.object({
  id: z.string().nonempty(),
  isActive: z.boolean(),
  dueDate: z.date(),
  semester: z.string(),
  description: z.string(),
  sections: z.array(ApplicationSectionSchema)
})

export type ApplicationSection = z.infer<typeof ApplicationSectionSchema>;
export type ApplicationForm = z.infer<typeof ApplicationFormSchema>
export type ApplicationQuestion = z.infer<typeof ApplicationQuestion>
