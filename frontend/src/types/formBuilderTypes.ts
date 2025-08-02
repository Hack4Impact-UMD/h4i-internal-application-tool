import { Timestamp } from "firebase/firestore";

export enum ApplicantRole {
  Bootcamp = "bootcamp",
  Engineer = "engineer",
  Designer = "designer",
  Product = "product",
  // Sourcing = "sourcing",
  TechLead = "tech-lead",
  SocialMedia = "social-media-manager",
  OutreachCoord = "outreach-coordinator",
}

export enum QuestionType {
  ShortAnswer = "short-answer",
  LongAnswer = "long-answer",
  MultipleChoice = "multiple-choice",
  MultipleSelect = "multiple-select",
  FileUpload = "file-upload",
  RoleSelect = "role-select",
}

// stores data about the content of the application forms
export interface ApplicationForm {
  id: string;
  isActive: boolean;
  dueDate: Timestamp;
  semester: string;
  description: string;
  sections: ApplicationSection[];
  decisionsReleased: boolean;
  scoreWeights: {
    [role in ApplicantRole]: {
      [score in string]: number; // weight for role + score category, between 0-4
    };
  };
  interviewScoreWeights?: {
    // optional because interviews seem to have only one score rn
    [role in ApplicantRole]: {
      [score in string]: number; // weight for role + score category, between 0-4
    };
  };
}

export interface ApplicationSection {
  sectionId: string; //no spaces, alphanumeric, unique (used as a route param)
  sectionName: string;
  description?: string;
  forRoles?: ApplicantRole[]; // some sections are role specific
  questions: ApplicationQuestion[];
}

export interface IApplicationQuestion {
  questionId: string;
  questionType: QuestionType;
  optional: boolean;
  questionText: string;
  secondaryText?: string;
}

export interface TextQuestion extends IApplicationQuestion {
  questionType: QuestionType.ShortAnswer | QuestionType.LongAnswer;
  placeholderText: string;
  maximumWordCount?: number;
  minimumWordCount?: number;
}

export interface OptionQuestion extends IApplicationQuestion {
  questionType: QuestionType.MultipleChoice | QuestionType.MultipleSelect;
  multipleSelect: boolean;
  questionOptions: string[];
}

export interface FileUploadQuestion extends IApplicationQuestion {
  questionType: QuestionType.FileUpload;
  fileId: string;
}

export interface RoleSelectQuestion extends IApplicationQuestion {
  questionType: QuestionType.RoleSelect;
}

//helps with automatic type inference based on the questionType field
export type ApplicationQuestion =
  | TextQuestion
  | OptionQuestion
  | FileUploadQuestion
  | RoleSelectQuestion;

// type MockData = {
//     applicationForms: [ApplicationForm]
// }
//
//
// const data: MockData = {
//     applicationForms: [
//         {
//             id: "",
//             description: "A sample form for testing",
//             dueDate: Timestamp.now(),
//             isActive: true,
//             semester: "Fall 2025",
//             sections: [
//                 {
//                     questions: [
//                         {
//                             questionType: QuestionType.ShortAnswer,
//                             optional: false,
//                             questionId: "q1",
//                             questionText: "A simple question",
//                             secondaryText: "Secondary text...",
//                         } as TextQuestion,
//                         {
//                             questionType: QuestionType.LongAnswer,
//                             optional: true,
//                             questionId: "q2",
//                             questionText: "Another simple question",
//                             placeholderText: "foo",
//                             minimumWordCount: 100,
//                             maximumWordCount: 500,
//                         } as TextQuestion,
//                         {
//                             multipleSelect: true,
//                             optional: false,
//                             questionId: "q3",
//                             questionText: "Multiple Selection",
//                             questionOptions: ["Option 1", "Option 2", "Option 3"],
//                             questionType: QuestionType.MultipleSelect,
//                             secondaryText: "Some secondary text..."
//                         } as OptionQuestion,
//                         {
//                             questionId: "q4",
//                             optional: false,
//                             questionText: "Select a role",
//                             roleSections: {
//                                 "bootcamp": "role-bc",
//                                 "sourcing": "role-source",
//                                 "tech-lead": "role-tl",
//                                 "engineer": "role-engineer",
//                                 "designer": "role-design",
//                                 "product": "role-product"
//                             }
//                         } as RoleSelectQuestion
//                     ],
//                     sectionName: "Section 1",
//                     sectionId: "section-1"
//                 },
//                 {
//                     sectionId: "role-bc",
//                     sectionName: "Bootcamp Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Bootcamp]
//                 },
//                 {
//                     sectionId: "role-source",
//                     sectionName: "Sourcing Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Sourcing]
//                 },
//                 {
//                     sectionId: "role-tl",
//                     sectionName: "Tech Lead Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.TechLead]
//                 },
//                 {
//                     sectionId: "role-engineer",
//                     sectionName: "Engineer Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Engineer]
//                 },
//                 {
//                     sectionId: "role-design",
//                     sectionName: "Design Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Designer]
//                 },
//                 {
//                     sectionId: "role-product",
//                     sectionName: "Product Section",
//                     questions: [],
//                     forRoles: [ApplicantRole.Product]
//                 },
//             ]
//         }
//     ]
// }
//
// console.log(JSON.stringify(data))
