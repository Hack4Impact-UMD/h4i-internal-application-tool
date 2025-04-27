import { ApplicationSection, QuestionType, OptionQuestion, QuestionResponse, RoleSelectQuestion } from '../../types/types';
import OneLineInput from './OneLineInput';
import LongFormInput from './LongFormInput';
import ChoiceGroup from './ChoiceGroup';
import MultiSelectGroup from './MultiSelectGroup';

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
                  console.log("hello there:", value)
                }}
              /> : null}
          </div>
        );
      })}

    </div>
  );
};

export default Section;
