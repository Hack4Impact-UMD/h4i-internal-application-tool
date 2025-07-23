import { getApplicationForm } from "@/services/applicationFormsService";
import {
  ApplicantRole,
  ApplicationForm,
  ApplicationReviewData,
  ApplicationInterviewData,
} from "@/types/types";

export async function calculateReviewScore(
  review: ApplicationReviewData,
): Promise<number> {
  const scores = Object.keys(review.applicantScores);
  if (scores.length == 0) return 0;

  const form: ApplicationForm = await getApplicationForm(
    review.applicationFormId,
  );

  if (!form.scoreWeights) {
    // fallback to simple average
    return roundScore(averageScore(review), 2);
  }

  if (
    !validateScoreCategoriesForFormAndRole(
      form.scoreWeights[review.forRole],
      review.applicantScores,
    )
  ) {
    return Promise.reject(-1); // TODO: find a more permanent solution for rejection
  }
  const score = calculateScoreForFormAndRole(
    form.scoreWeights[review.forRole],
    review.applicantScores,
  );
  return roundScore(score, 2);
}

function averageScore(review: ApplicationReviewData) {
  if (Object.values(review.applicantScores).length == 0) return 0;
  const scores = Object.values(review.applicantScores);
  return scores.reduce((acc, s) => acc + s, 0) / scores.length;
}

function validateScoreCategoriesForFormAndRole(
  scoreWeightsForRole: ApplicationForm["scoreWeights"][ApplicantRole],
  applicantScores: ApplicationReviewData["applicantScores"] | ApplicationInterviewData["applicantScores"],
): boolean {
  return Object.keys(scoreWeightsForRole).every(
    (weight) => weight in applicantScores,
  );
}

function calculateScoreForFormAndRole(
  scoreWeightsForRole: ApplicationForm["scoreWeights"][ApplicantRole],
  applicantScores: ApplicationReviewData["applicantScores"] | ApplicationInterviewData["applicantScores"],
): number {
  return Object.keys(scoreWeightsForRole).reduce((acc, scoreCategory) => {
    const weight = scoreWeightsForRole[scoreCategory] ?? 0;
    const score = applicantScores[scoreCategory] ?? 0;
    return acc + weight * score;
  }, 0);
}

// TODO: need to check if this would be useful for avg. score/elsewhere
function roundScore(score: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((score + Number.EPSILON) * factor) / factor;
}

export async function calculateInterviewScore(
  interview: ApplicationInterviewData,
): Promise<number> {
  const scores = Object.keys(interview.applicantScores);
  if (scores.length == 0) return 0;

  const form: ApplicationForm = await getApplicationForm(
    interview.applicationFormId,
  );

  if (!form.scoreWeights) {
    // fallback to simple average
    return roundScore(averageInterviewScore(interview), 2);
  }

  if (
    !validateScoreCategoriesForFormAndRole(
      form.scoreWeights[interview.forRole],
      interview.applicantScores,
    )
  ) {
    throw new Error("Invalid score categories for interview");
  }
  const score = calculateScoreForFormAndRole(
    form.scoreWeights[interview.forRole],
    interview.applicantScores,
  );
  return roundScore(score, 2);
}

function averageInterviewScore(interview: ApplicationInterviewData) {
  if (Object.values(interview.applicantScores).length == 0) return 0;
  const scores = Object.values(interview.applicantScores);
  return scores.reduce((acc, s) => acc + s, 0) / scores.length;
}
