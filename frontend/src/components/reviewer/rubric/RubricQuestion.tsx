import FormMarkdown from "@/components/form/FormMarkdown";
import { ReviewRubricQuestion } from "@/types/types";
import { RubricScoreButton } from "./RubricScoreButton";

type RubricQuestionProps = {
  question: ReviewRubricQuestion;
  onChange: (key: string, value: number) => void;
  value: number;
};

export function RubricQuestion({
  question,
  onChange,
  value,
}: RubricQuestionProps) {
  return (
    <div className="">
      <span className="text-lg">{question.prompt}</span>
      <FormMarkdown>{question.description}</FormMarkdown>
      <div className="bg-muted flex flex-row gap-4 items-stretch rounded-xl p-3">
        {Array.from(
          { length: (question.maxValue ?? 4) - (question.minValue ?? 0) + 1 },
          (_, i) => i + (question.minValue ?? 0),
        ).map((score) => (
          <RubricScoreButton
            key={score}
            score={score}
            selected={value === score}
            onClick={() => onChange(question.scoreKey, score)}
          />
        ))}
      </div>
    </div>
  );
}
