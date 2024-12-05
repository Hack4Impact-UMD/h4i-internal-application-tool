// Questions for the Product Manager application
export interface ProductManagerData {
  whyPM: string;
  ledAndDelegate: string;
  offTrack: string;
  unmotivatedTeam: string;
  failedDeadline: string;
  scenario: string;
  useNotion: string;
  testFile: File;
  testCB: string[];
}

// Questions for the BootCamp application
export interface BootCampData {
  interest: string;
  newSkill: string;
  challengePersist: string;
}

//Questions for the Engineer app
export interface EngineerData {
  whyEngineer: string;
  engineerFit: string;
  gitExperience: string;
  codeExperience: string;
  mistakeExperience: string;
  sprintExperience: string;
  technicalSubmission: string;
  comments: string;
}

//Questions for the Tech Lead app
export interface TechLeadData {
  whyTechLead: string;
  techLeadFit: string;
  gitExperience: string;
  codeExperience: string;
  projectExperience: string;
  technicalSubmission: string;
  comments: string;
}

// Questions for the Designer/UX application
export interface UXData {
  whyUX: string;
  strongFit: string;
  workflow: string;
  situationalResponse: string;
  collaboration: string;
  figmaExp: string;
  yoe: string;
  portfolio: string;
}

// Questions for the Sourcing application
export interface SourcingData {
  clubExp: string;
  videoCalls: string;
  strongFit: string;
  exampleTask: string;
  npoExp: string;
}

// General Information questions
export interface GeneralInfoData {
  email: string;
  name: string;
  preferredName: string;
  year: string;
  major: string;
  minor: string;
  csClasses: string[];
  csTopics: string[];
  skills: string;
  resume: string;
  whyH4I: string;
  differences: string;
  awareness: string;
  commitments: string;
  involvement: string;
  initiative: string;
  giveBack: string;
}

// Demographics questions
export interface DemographicData {
  pronouns: string;
  gender: string;
  transgender: string;
  race: string[];
}

// Choosing roles
export interface RolesData {
  roles: string[];
}

// This interface maps each form section to its specific datatype which allows
// TS to infer the correct type of data based on formSection.
export interface FormDataMap {
  bootCampData: BootCampData;
  productManagerData: ProductManagerData;
  engineerData: EngineerData;
  techLeadData: TechLeadData;
  UXData: UXData;
  sourcingData: SourcingData;
  generalInfoData: GeneralInfoData;
  demographicData: DemographicData;
  rolesData: RolesData;
  // Add more form types (engineer, sourcing, etc.) when nec,
  // and update "formDataInterfaces.ts" accordingly
}

// All forms will need to import this interface to update the state in the
// parent.
export interface FormProps<T extends object> {
  onFormDataChange: (
    field: keyof T,
    value: T[keyof T],
    otherUnchecked?: boolean
  ) => void;
  sectionFormData: T;
}
