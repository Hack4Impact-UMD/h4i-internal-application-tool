import { throwWarningToast } from "@/components/toasts/WarningToast";
import { getApplicationForm } from "@/services/applicationFormsService";
import {
  ApplicationForm,
  ApplicationInterviewData,
  ApplicationReviewData,
} from "@/types/types";

export async function calculateReviewScore(
  review: ApplicationReviewData
): Promise<number> {
  const scores = Object.keys(review.applicantScores);
  if (scores.length === 0) return 0;

  const form: ApplicationForm = await getApplicationForm(
    review.applicationFormId
  );

  if (!form.scoreWeights) {
    throwWarningToast(
      "Form does not have review weights, falling back to average scoring!"
    );
    return roundScore(averageScore(review.applicantScores), 2);
  }

  const weightsForRole = form.scoreWeights?.[review.forRole];
  if (!weightsForRole) {
    throwWarningToast(
      "Form does not have review weights for this role, falling back to average scoring!"
    );
    return roundScore(averageScore(review.applicantScores), 2);
  }

  return calculateScore(weightsForRole, review.applicantScores);
}

export async function calculateInterviewScore(
  interview: ApplicationInterviewData
): Promise<number> {
  const scores = Object.keys(interview.interviewScores);
  if (scores.length === 0) return 0;

  const form: ApplicationForm = await getApplicationForm(
    interview.applicationFormId
  );

  console.log("this is running");
  
  if (!form.interviewScoreWeights) {
    throwWarningToast(
      "Form does not have interview weights, falling back to average scoring!"
    );
    return roundScore(averageScore(interview.interviewScores), 2);
  }

  const weightsForRole = form.interviewScoreWeights?.[interview.forRole];
  if (!weightsForRole) {
    throwWarningToast(
      "Form does not have interview weights for this role, falling back to average scoring!"
    );
    return roundScore(averageScore(interview.interviewScores), 2);
  }

  return calculateScore(weightsForRole, interview.interviewScores);
}

export function calculateScore(
  weights: Record<string, number>,
  scores: Record<string, number>,
): number {
  if (hasScoreKeyMismatch(weights, scores)) {
    throwWarningToast(
      "Form and scores don't have matching keys, falling back to average scoring!"
    );
    return roundScore(averageScore(scores), 2);
  }

  if (missingRequiredScoreKeys(weights, scores)) {
    throwWarningToast(
      "Score does not have all requirement weights, falling back to average scoring!"
    );
    return 0;
  }

  const score = Object.keys(weights).reduce((acc, scoreCategory) => {
    const weight = weights[scoreCategory] ?? 0;
    const score = scores[scoreCategory] ?? 0;
    return acc + weight * score;
  }, 0);
  return roundScore(score, 2);
}

function averageScore(scores: Record<string, number>) {
  if (Object.values(scores).length == 0) return 0;
  const scoreValues = Object.values(scores);
  return scoreValues.reduce((acc, s) => acc + s, 0) / scoreValues.length;
}

function hasScoreKeyMismatch(
  weights: Record<string, number>,
  scores: Record<string, number>,
): boolean {
  const formWeightKeys = Object.keys(weights);
  const scoreKeys = Object.keys(scores ?? {});

  const keysMatch =
    formWeightKeys.length === scoreKeys.length &&
    formWeightKeys.every((k) => k in scores) &&
    scoreKeys.every((k) => k in weights);

  console.log("weights" + formWeightKeys)
  console.log("scores" + scoreKeys);
    
  return !keysMatch && scoreKeys.length >= formWeightKeys.length;
}

function missingRequiredScoreKeys(
  weights: Record<string, number>,
  scores: Record<string, number>,
): boolean {
  return !Object.keys(weights).every(weight => weight in scores,);
}

function roundScore(score: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((score + Number.EPSILON) * factor) / factor;
}
