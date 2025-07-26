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
    return Promise.reject(-1); // TODO: find a more permanent solution for rejection
  }
  const score = calculateScoreForFormAndRole(
    form.scoreWeights[review.forRole],
    review.applicantScores,
  );
  return roundScore(score, 2);
}

//TODO: implement better
export async function calculateInterviewScore(
  interviewData: ApplicationInterviewData,
) {
  return Promise.resolve(averageScore(interviewData));
}

function averageScore(
  review: ApplicationReviewData | ApplicationInterviewData,
) {
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

// TODO: need to check if this would be useful for avg. score/elsewhere
function roundScore(score: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((score + Number.EPSILON) * factor) / factor;
}
