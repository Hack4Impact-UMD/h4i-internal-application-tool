import { ApplicationSection, QuestionType, OptionQuestion, QuestionResponse, RoleSelectQuestion } from '../../types/types';
import OneLineInput from './OneLineInput';
import LongFormInput from './LongFormInput';
import ChoiceGroup from './ChoiceGroup';
import MultiSelectGroup from './MultiSelectGroup';
import Button from '../Button';

interface SectionProps {
  section: ApplicationSection;
  responses: QuestionResponse[];
  onChangeResponse: (questionId: string, value: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
}

const Section: React.FC<SectionProps> = ({
  section,
  responses,
  onChangeResponse,
  onNext,
  onPrevious,
  isNextDisabled,
  isPreviousDisabled,
}) => {
  return (
    <div className="flex flex-col justify-self-center w-full max-w-3xl m-3 pt-16 pb-8 px-16 rounded-xl shadow-sm border border-gray-200 bg-white">
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

      <div className="flex gap-1 mt-4">
        <Button
          className="border border-gray-400 text-black bg-white hover:bg-gray-100 px-8 rounded-full"
          label="Back"
          enabled={!isPreviousDisabled}
          onClick={onPrevious}
        />
        <Button
          className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
          label="Next >"
          enabled={!isNextDisabled}
          onClick={onNext}
        />
      </div>
    </div>
  );
};

export default Section;
