import { ApplicantRole, ApplicationReviewData, ScoreCategory } from "@/types/types";

export async function calculateReviewScore(
  review: ApplicationReviewData,
): Promise<number> {
  const scores = Object.keys(review.applicantScores);
  if (scores.length == 0) return 0;
  const res = getScoreForApplicationAndRole(
    review.applicationFormId, 
    review.forRole, 
    review.applicantScores
  )
  // const res =
  //   scores.reduce((acc, v) => acc + review.applicantScores[v], 0) /
  //   scores.length;
  console.log("score: ", res);
  return res == -1 ? Promise.reject(res) : Promise.resolve(res);
}

// this will route requests to a semester/form-specific scoring + validation 
// functions, which will be needed to preserve calculations from previous semesters
function getScoreForApplicationAndRole(
  applicationFormId: string, 
  forRole: ApplicantRole, 
  applicantScores: Record<ScoreCategory, number>
): number {
  switch(applicationFormId) {
    case "sample-form":
    case "sample-form2":
    default: {
      const score = calculateScoreForRoleFall2025(forRole, applicantScores);
      const roundedScore = roundScore(score, 2)
      return roundedScore
    }
  }
}

function calculateScoreForRoleFall2025(
  role: ApplicantRole, 
  scores: Record<ScoreCategory, number>
): number {
  if (!validateScoresFall2025(role, scores)) {
    console.warn(`Invalid score keys or values for role ${role}, returning -1`);
    return -1;  
  }

  switch (role) {
    case ApplicantRole.Bootcamp: {
      return scores[ScoreCategory.Club] * 0.5 + scores[ScoreCategory.SocialGood] * 0.5;
    }
    case ApplicantRole.Sourcing: {
      return (
        scores[ScoreCategory.Club] * 0.3 + 
        scores[ScoreCategory.SocialGood] * 0.3 + 
        scores[ScoreCategory.NpoExpertise] * 0.3 +
        scores[ScoreCategory.Technical] * 0.1
      );
    }
    case ApplicantRole.Engineer:
    case ApplicantRole.Designer:
    case ApplicantRole.Product:
    case ApplicantRole.TechLead:
    default: {
      return (
        scores[ScoreCategory.Club] * 0.25 + 
        scores[ScoreCategory.SocialGood] * 0.2 + 
        scores[ScoreCategory.Technical] * 0.55
      );
    }
  }
}

function validateScoresFall2025(
  role: ApplicantRole,
  scores: Record<ScoreCategory, number>
): boolean {
  let requiredKeys: ScoreCategory[];

  switch (role) {
    case ApplicantRole.Bootcamp:
      requiredKeys = [ScoreCategory.Club, ScoreCategory.SocialGood];
      break;
    case ApplicantRole.Sourcing:
      requiredKeys = [
        ScoreCategory.Club,
        ScoreCategory.SocialGood,
        ScoreCategory.NpoExpertise,
        ScoreCategory.Communication,
      ];
      break;
    case ApplicantRole.Engineer:
    case ApplicantRole.Designer:
    case ApplicantRole.Product:
    case ApplicantRole.TechLead:
      requiredKeys = [
        ScoreCategory.Club,
        ScoreCategory.SocialGood,
        ScoreCategory.Technical,
      ];
      break;
    default:
      console.warn(`Unknown role: ${role}`);
      return false;
  }

  return requiredKeys.every(
    (key) =>
      typeof scores[key] === "number" &&
      scores[key]! >= 1 &&
      scores[key]! <= 4
  );
}

// TODO: need to check if this would be useful for avg. score/elsewhere
function roundScore(score: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((score + Number.EPSILON) * factor) / factor;
}