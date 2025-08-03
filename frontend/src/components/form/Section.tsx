import {
  ApplicationSection,
  QuestionType,
  OptionQuestion,
  QuestionResponse,
  ApplicantRole,
  ValidationError,
} from "../../types/types";
import OneLineInput from "./OneLineInput";
import LongFormInput from "./LongFormInput";
import ChoiceGroup from "./ChoiceGroup";
import MultiSelectGroup from "./MultiSelectGroup";
import useForm from "../../hooks/useForm";
import FileUpload from "./FileUpload";
import {
  applicantRoleColor,
  applicantRoleDarkColor,
  displayApplicantRoleName,
} from "@/utils/display";
import FormMarkdown from "./FormMarkdown";

interface SectionProps {
  section: ApplicationSection;
  responses: QuestionResponse[];
  disabled?: boolean;
  validationErrors?: ValidationError[];
  onChangeResponse?: (questionId: string, value: string | string[]) => void;
  responseId: string;
}

const Section: React.FC<SectionProps> = ({
  section,
  responses,
  onChangeResponse = () => { },
  validationErrors,
  disabled = false,
  responseId,
}) => {
  const { setSelectedRoles } = useForm();
  return (
    <div className="mt-2 mb-2 flex flex-col gap-5">
      <div>
        <h1 className="font-bold text-xl">{section.sectionName}</h1>
        <FormMarkdown>{section.description}</FormMarkdown>
      </div>
      {section.questions.map((question) => {
        const response =
          responses.find((r) => r.questionId === question.questionId)
            ?.response || "";
        const validationError = validationErrors?.find(
          (e) => e.questionId == question.questionId,
        );

        return (
          <div key={question.questionId}>
            {question.questionType === QuestionType.ShortAnswer ? (
              <OneLineInput
                disabled={disabled}
                question={question.questionText}
                isRequired={!question.optional}
                errorMessage={validationError?.message}
                label={question.secondaryText}
                value={typeof response === "string" ? response : ""}
                onChange={(value) =>
                  onChangeResponse(question.questionId, value)
                }
                placeholderText={question.placeholderText}
              />
            ) : question.questionType === QuestionType.LongAnswer ? (
              <LongFormInput
                disabled={disabled}
                question={question.questionText}
                errorMessage={validationError?.message}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={typeof response === "string" ? response : ""}
                maxWordCount={question.maximumWordCount}
                minWordCount={question.minimumWordCount}
                onChange={(value) =>
                  onChangeResponse(question.questionId, value)
                }
                placeholderText={question.placeholderText}
              />
            ) : (question as OptionQuestion).questionOptions &&
              question.questionType === QuestionType.MultipleChoice ? (
              <ChoiceGroup
                disabled={disabled}
                question={question.questionText}
                errorMessage={validationError?.message}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={typeof response === "string" ? response : ""}
                options={(question as OptionQuestion).questionOptions ?? []}
                onOptionSelect={(value) =>
                  onChangeResponse(question.questionId, value ?? "")
                }
              />
            ) : (question as OptionQuestion).questionOptions &&
              question.questionType === QuestionType.MultipleSelect ? (
              <MultiSelectGroup
                disabled={disabled}
                question={question.questionText}
                errorMessage={validationError?.message}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={Array.isArray(response) ? response : []}
                options={(question as OptionQuestion).questionOptions ?? []}
                onOptionSelect={(value) =>
                  onChangeResponse(question.questionId, value ?? [])
                }
              />
            ) : question.questionType === QuestionType.FileUpload ? (
              <FileUpload
                fileId={question.fileId}
                question={question.questionText}
                secondaryText={question.secondaryText}
                errorMessage={validationError?.message}
                onChange={(value) =>
                  onChangeResponse(question.questionId, value)
                }
                disabled={disabled}
                required={!question.optional}
                responseId={responseId}
                value={response as string}
              />
            ) : question.questionType == QuestionType.RoleSelect ? (
              <MultiSelectGroup
                disabled={disabled}
                question={"Which roles do you want to apply for?"}
                errorMessage={validationError?.message}
                isRequired={true}
                label={
                  "You are encouraged to apply to multiple roles at the same time if you believe they are a good fit."
                }
                value={Array.isArray(response) ? response : []}
                options={Object.values(ApplicantRole)}
                onOptionSelect={(value) => {
                  console.log("setting selected roles to: ", value);
                  onChangeResponse(question.questionId, value ?? []);
                  setSelectedRoles(value as ApplicantRole[]);
                }}
                displayName={(key) =>
                  displayApplicantRoleName(key as ApplicantRole)
                }
                displayDarkColor={(role) =>
                  applicantRoleDarkColor(role as ApplicantRole)
                }
                displayColor={(role) =>
                  applicantRoleColor(role as ApplicantRole)
                }
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Section;
