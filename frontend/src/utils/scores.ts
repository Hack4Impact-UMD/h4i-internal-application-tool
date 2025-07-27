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

export async function calculateInterviewScore(
  interviewData: ApplicationInterviewData,
): Promise<number> {
  const scores = Object.keys(interviewData.applicantScores);
  if (scores.length === 0) {
    return 0;
  }

  const form: ApplicationForm = await getApplicationForm(
    interviewData.applicationFormId,
  );

  if (!form.interviewScoreWeights) {
    /**
     * If the interview form does not have weights, we fall back to a simple average.
     * This might be because weights have not been configured for this form, or
     * this semester's interviews are not using weighted scores.
     */
    return roundScore(averageScore(interviewData), 2);
  }

  const weightsForRole = form.interviewScoreWeights[interviewData.forRole];
  if (!weightsForRole) {
    // Fallback to simple average if no weights for the specific role
    return roundScore(averageScore(interviewData), 2);
  }

  if (
    !validateScoreCategoriesForFormAndRole(
      weightsForRole,
      interviewData.applicantScores,
    )
  ) {
    // TODO: find a more permanent solution for rejection
    return Promise.reject(
      new Error("Interview scores do not match weighted categories."),
    );
  }

  const score = calculateScoreForFormAndRole(
    weightsForRole,
    interviewData.applicantScores,
  );

  return roundScore(score, 2);
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
