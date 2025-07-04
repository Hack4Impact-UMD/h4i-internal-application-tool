import { ApplicationReviewData } from "@/types/types";

//TODO: When scoring formulas are implemented this function should be changed!
export async function calculateReviewScore(
  review: ApplicationReviewData,
): Promise<number> {
  const scores = Object.keys(review.applicantScores);
  if (scores.length == 0) return 0;
  const res =
    scores.reduce((acc, v) => acc + review.applicantScores[v], 0) /
    scores.length;
  console.log("score: ", res);
  return Promise.resolve(res);
}
