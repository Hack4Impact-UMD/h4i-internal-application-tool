import {
  ApplicantRole,
  ApplicationForm,
  ApplicationReviewData,
  RoleReviewRubric,
} from "@/types/types";
import { displayApplicantRoleNameNoEmoji } from "@/utils/display";
import { RubricQuestion } from "./RubricQuestion";
import FormMarkdown from "@/components/form/FormMarkdown";
import { Textarea } from "@/components/ui/textarea";

type RoleRubricProps = {
  rubric: RoleReviewRubric;
  onScoreChange: (key: string, value: number) => void;
  onCommentChange: (rubricId: string, comments: string) => void;
  reviewData: ApplicationReviewData;
  disabled?: boolean;
  form?: ApplicationForm; //optional, for displaying score weights
  role: ApplicantRole;
};

export default function RoleRubric({
  rubric,
  role,
  onScoreChange,
  onCommentChange,
  reviewData,
  disabled = false,
  form = undefined,
}: RoleRubricProps) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 flex flex-col gap-2">
      <h1 className="font-bold text-xl">
        {rubric.roles.length > 0
          ? rubric.roles.map(displayApplicantRoleNameNoEmoji).join(", ")
          : "General"}{" "}
        Rubric
      </h1>
      {rubric.detailLink && (
        <span>
          Details:{" "}
          <a href={rubric.detailLink} target="_black" rel="noopener noreferrer">
            {rubric.detailLink}
          </a>
        </span>
      )}
      <div className="flex flex-col gap-2">
        {rubric.rubricQuestions.map((q) => (
          <RubricQuestion
            disabled={disabled}
            key={q.scoreKey}
            question={q}
            onChange={onScoreChange}
            weight={form?.scoreWeights[role]?.[q.scoreKey]}
            value={reviewData.applicantScores[q.scoreKey]}
          />
        ))}
      </div>
      <h2 className="text-lg">Review Comments</h2>
      <FormMarkdown>{rubric.commentsDescription}</FormMarkdown>
      <Textarea
        disabled={disabled}
        className="disabled:opacity-100"
        defaultValue={reviewData.reviewerNotes[rubric.id] ?? ""}
        onChange={(e) => onCommentChange(rubric.id, e.target.value)}
      ></Textarea>
    </div>
  );
}
