import { ApplicationSection, QuestionType, OptionQuestion, QuestionResponse, RoleSelectQuestion, ApplicantRole } from '../../types/types';
import OneLineInput from './OneLineInput';
import LongFormInput from './LongFormInput';
import ChoiceGroup from './ChoiceGroup';
import MultiSelectGroup from './MultiSelectGroup';
import useForm from '../../hooks/useForm';

interface SectionProps {
  section: ApplicationSection;
  responses: QuestionResponse[];
  onChangeResponse: (questionId: string, value: string | string[]) => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  responses,
  onChangeResponse,
}) => {
  const { setSelectedRoles } = useForm()
  return (
    <div className="mt-2 mb-2 flex flex-col gap-5">
      <h1 className="font-bold text-xl">{section.sectionName}</h1>
      {section.questions.map((question) => {
        const response = responses.find((r) => r.questionId === question.questionId)?.response || '';

        return (
          <div key={question.questionId}>
            {question.questionType === QuestionType.ShortAnswer ? (
              <OneLineInput
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={typeof response === 'string' ? response : ''}
                onChange={(value) => onChangeResponse(question.questionId, value)}
              />
            ) : question.questionType === QuestionType.LongAnswer ? (
              <LongFormInput
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={typeof response === 'string' ? response : ''}
                onChange={(value) => onChangeResponse(question.questionId, value)}
              />
            ) : (question as OptionQuestion).questionOptions && question.questionType === QuestionType.MultipleChoice ? (
              <ChoiceGroup
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={typeof response === 'string' ? response : ""}
                options={(question as OptionQuestion).questionOptions ?? []}
                onOptionSelect={(value) => onChangeResponse(question.questionId, value ?? '')}
              />
            ) : (question as OptionQuestion).questionOptions && question.questionType === QuestionType.MultipleSelect ? (
              <MultiSelectGroup
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={Array.isArray(response) ? response : []}
                options={(question as OptionQuestion).questionOptions ?? []}
                onOptionSelect={(value) => onChangeResponse(question.questionId, value ?? [])}
              />
            ) : (question.questionType == QuestionType.RoleSelect) ?
              <MultiSelectGroup
                question={"Which roles do you want to apply for?"}
                isRequired={true}
                label={"You are encouraged to apply to multiple roles at the same time if you believe they are a good fit."}
                value={Array.isArray(response) ? response : []}
                options={Object.keys((question as RoleSelectQuestion).roleSections)}
                onOptionSelect={(value) => {
                  console.log("setting selected roles to: ", value)
                  onChangeResponse(question.questionId, value ?? [])
                  setSelectedRoles(value as ApplicantRole[])
                }}
                displayName={(key) => {
                  if (key == ApplicantRole.Bootcamp) return "Bootcamp"
                  else if (key == ApplicantRole.TechLead) return "Tech Lead"
                  else if (key == ApplicantRole.Product) return "Product"
                  else if (key == ApplicantRole.Sourcing) return "Sourcing"
                  else if (key == ApplicantRole.Engineer) return "Engineer"
                  else if (key == ApplicantRole.Designer) return "Designer"
                  else return key
                }}
              /> : null}
          </div>
        );
      })}
    </div>
  );
};

export default Section;
