import {
  ApplicationSection,
  QuestionType,
  OptionQuestion,
  QuestionResponse,
  RoleSelectQuestion,
  ApplicantRole,
  ValidationError,
} from "../../types/types";
import OneLineInput from "./OneLineInput";
import LongFormInput from "./LongFormInput";
import ChoiceGroup from "./ChoiceGroup";
import MultiSelectGroup from "./MultiSelectGroup";
import useForm from "../../hooks/useForm";
import FileUpload from "./FileUpload";
import { displayApplicantRoleName, displayUserRoleName } from "@/utils/display";

interface SectionProps {
  section: ApplicationSection;
  responses: QuestionResponse[];
  disabled?: boolean;
  validationErrors?: ValidationError[];
  onChangeResponse?: (questionId: string, value: string | string[]) => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  responses,
  onChangeResponse = () => {},
  validationErrors,
  disabled = false,
}) => {
  const { setSelectedRoles } = useForm();
  return (
    <div className="mt-2 mb-2 flex flex-col gap-5">
      <h1 className="font-bold text-xl">{section.sectionName}</h1>
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
                question={question.questionText}
                secondaryText={question.secondaryText}
                errorMessage={validationError?.message}
                onChange={(value) =>
                  onChangeResponse(question.questionId, value)
                }
                disabled={disabled}
                required={!question.optional}
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
                options={Object.keys(
                  (question as RoleSelectQuestion).roleSections,
                )}
                onOptionSelect={(value) => {
                  console.log("setting selected roles to: ", value);
                  onChangeResponse(question.questionId, value ?? []);
                  setSelectedRoles(value as ApplicantRole[]);
                }}
                displayName={(key) =>
                  displayApplicantRoleName(key as ApplicantRole)
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
