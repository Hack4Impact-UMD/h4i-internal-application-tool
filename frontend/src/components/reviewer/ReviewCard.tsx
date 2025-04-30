import { useState } from "react";
import { twMerge } from "tailwind-merge";

const reviewCategories = [
  {
    label: "Interest in Club",
    key: "interestInClub",
  },
  {
    label: "Interest in Social Good",
    key: "interestInSocialGood",
  },
  {
    label: "Technical Expertise",
    key: "technicalExpertise",
  },
];

const assessmentCategories = [
  { label: "Functionality", key: "functionality" },
  { label: "Visual", key: "visual" },
  { label: "Coding Practices", key: "codingPractices" },
  { label: "Coding Style", key: "codingStyle" },
];

// Add this type for all possible score keys
const allScoreKeys = [
  "interestInClub",
  "interestInSocialGood",
  "technicalExpertise",
  "functionality",
  "visual",
  "codingPractices",
  "codingStyle",
] as const;
type ScoreKey = typeof allScoreKeys[number];

type Scores = Record<ScoreKey, number | null>;

export default function ReviewCard() {
  const [scores, setScores] = useState<Scores>({
    interestInClub: null,
    interestInSocialGood: null,
    technicalExpertise: null,
    functionality: null,
    visual: null,
    codingPractices: null,
    codingStyle: null,
  });
  const [notes, setNotes] = useState("");

  const handleScoreChange = (key: ScoreKey, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const hasMissingScores = Object.values(scores).some(v => v === null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasMissingScores) {
      alert("Please give every category a score before submitting.");
      return;
    }
    alert("Submitted!");
  };

  // Custom OptionButton for scoring section
  const ScoreButton = ({ score, selected, onClick }: { score: number; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-24 h-14 flex items-center justify-center rounded-md text-sm transition border-none outline-none focus:ring-2 focus:ring-blue-400
        ${selected ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}
      style={{ boxShadow: "none" }}
    >
      {score}
    </button>
  );

  return (
      <form onSubmit={handleSubmit} className="m-3">
        <div className="w-[475px] flex-shrink-0">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-6 border border-gray-400">
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Engineer Review</h2>
              <a href="#" className="text-blue-600 underline text-sm block mt-1">Rubric link</a>
            </div>
            {reviewCategories.map((cat) => (
              <div key={cat.key} className="mb-0">
                <div className="font-medium mb-0">{cat.label}</div>
                <div className="flex flex-row gap-4 bg-gray-100 rounded-xl p-3">
                  {[0, 1, 2, 3, 4].map((score) => (
                    <ScoreButton
                      key={score}
                      score={score}
                      selected={scores[cat.key as ScoreKey] === score}
                      onClick={() => handleScoreChange(cat.key as ScoreKey, score)}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="text-xl font-semibold mt-4 mb-2">Technical Assessment Scores</div>
            {assessmentCategories.map((cat) => (
              <div key={cat.key} className="mb-0">
                <div className="font-medium mb-0">{cat.label}</div>
                <div className="flex flex-row gap-4 bg-gray-100 rounded-xl p-3">
                  {[0, 1, 2, 3, 4].map((score) => (
                    <ScoreButton
                      key={score}
                      score={score}
                      selected={scores[cat.key as ScoreKey] === score}
                      onClick={() => handleScoreChange(cat.key as ScoreKey, score)}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4">
              <div className="font-medium mb-1">Additional notes</div>
              <textarea
                className="p-3 w-full h-32 border border-gray-400 focus:border-gray-400 focus:outline-none bg-transparent text-base rounded-md resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button
            type="submit"
            disabled={hasMissingScores}
            className={twMerge(
                "h-8 rounded-full text-sm font-semibold px-3 flex items-center justify-center mt-4 self-start",
                hasMissingScores ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
            )}
            >
            Submit
            </button>
          </div>
        </div>
      </form>
  );
}
