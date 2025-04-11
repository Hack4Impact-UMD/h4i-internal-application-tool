import {ApplicationSection, QuestionType, OptionQuestion } from '../../types/types';
import OneLineInput from './OneLineInput';
import LongFormInput from './LongFormInput';
import ChoiceGroup from './ChoiceGroup';
import MultiSelectGroup from './MultiSelectGroup';

interface SectionProps {
  section: ApplicationSection;
  responses: Record<string, Record<string, any>>
  onChangeResponse: (questionId: string, value: any) => void;
}

const Section: React.FC<SectionProps> = ({ section, responses, onChangeResponse}) => {
  return (
    <div className="flex flex-col justify-self-center w-[57%] m-3 p-5 rounded-xl shadow-sm border border-gray-200 bg-white">
      <div className='m-7 mt-2 mb-2'>
        {section.questions.map((question) => (
          <div key={question.id} className="m-8">
            {question.questionType === QuestionType.ShortAnswer ? (
              <OneLineInput
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={responses[section.sectionId]?.[question.id] ?? ''}
                onChange={(value) => onChangeResponse(question.id, value)}
              />
            ) : question.questionType === QuestionType.LongAnswer ? (
              <LongFormInput
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                value={responses[section.sectionId]?.[question.id] ?? ''}
                onChange={(value) => onChangeResponse(question.id, value)}
              />
            ) : (question as OptionQuestion).questionOptions && question.questionType === QuestionType.MultipleChoice ? (
              <ChoiceGroup
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                options={(question as OptionQuestion).questionOptions ?? []}
                onOptionSelect={(value) => onChangeResponse(question.id, value ?? '')}
              />
            ) :
             (question as OptionQuestion).questionOptions && question.questionType === QuestionType.MultipleSelect ? (
              <MultiSelectGroup
                question={question.questionText}
                isRequired={!question.optional}
                label={question.secondaryText}
                options={(question as OptionQuestion).questionOptions ?? []}
                onOptionSelect={(value) => onChangeResponse(question.id, value ?? [])}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
