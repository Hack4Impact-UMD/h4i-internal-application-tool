import { throwWarningToast } from "@/components/toasts/WarningToast";
import { getApplicationForm } from "@/services/applicationFormsService";
import {
  ApplicantRole,
  ApplicationForm,
  ApplicationInterviewData,
  ApplicationReviewData,
} from "@/types/types";

export async function calculateReviewScore(
  review: ApplicationReviewData,
): Promise<number> {
  const scores = Object.keys(review.applicantScores);
  if (scores.length == 0) return 0;

  const form: ApplicationForm = await getApplicationForm(
    review.applicationFormId,
  );

  const weightsForRole = form.scoreWeights?.[review.forRole];
  if (!weightsForRole) {
    console.warn(
      "Form does not have weights, falling back to average scoring!",
    );
    throwWarningToast(
      "Form does not have weights, falling back to average scoring!",
    );
    return roundScore(averageScore(review), 2);
  }
  const weightKeys = Object.keys(weightsForRole);
  const scoreKeys = Object.keys(review.applicantScores ?? {});
  const keysMatch =
    weightKeys.length === scoreKeys.length &&
    weightKeys.every((k) => k in review.applicantScores) &&
    scoreKeys.every((k) => k in weightsForRole);
  if (!keysMatch) {
    console.warn("SCORE KEY MISMATCH: Falling back to average scoring!");
    throwWarningToast(
      "Score key mismatch found, falling back to simple average!",
    );
    return roundScore(averageScore(review), 2);
  }

  if (!form.scoreWeights) {
    // fallback to simple average
    console.log("NO WEIGHTS");
    return roundScore(averageScore(review), 2);
  }

  if (
    !validateScoreCategoriesForFormAndRole(
      form.scoreWeights[review.forRole],
      review.applicantScores,
    )
  ) {
    return Promise.reject(-1);
  }
  const score = calculateScoreForFormAndRole(
    form.scoreWeights[review.forRole],
    review.applicantScores,
  );
  return roundScore(score, 2);
}

export async function calculateInterviewScore(
  interviewData: ApplicationInterviewData,
): Promise<number> {
  return Promise.resolve(interviewData.interviewScore);
}

function averageScore(review: ApplicationReviewData) {
  if (Object.values(review.applicantScores).length == 0) return 0;
  const scores = Object.values(review.applicantScores);
  return scores.reduce((acc, s) => acc + s, 0) / scores.length;
}

function validateScoreCategoriesForFormAndRole(
  scoreWeightsForRole: ApplicationForm["scoreWeights"][ApplicantRole],
  applicantScores: ApplicationReviewData["applicantScores"],
): boolean {
  return Object.keys(scoreWeightsForRole).every(
    (weight) => weight in applicantScores,
  );
}

function calculateScoreForFormAndRole(
  scoreWeightsForRole: ApplicationForm["scoreWeights"][ApplicantRole],
  applicantScores: ApplicationReviewData["applicantScores"],
): number {
  return Object.keys(scoreWeightsForRole).reduce((acc, scoreCategory) => {
    const weight = scoreWeightsForRole[scoreCategory] ?? 0;
    const score = applicantScores[scoreCategory] ?? 0;
    return acc + weight * score;
  }, 0);
}

function roundScore(score: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((score + Number.EPSILON) * factor) / factor;
}
