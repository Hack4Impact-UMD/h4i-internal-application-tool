import { ApplicantUserProfile } from "../types/types";

export const REVIEW_DATA_COLLECTION = "review-data"
//NOTE: the documents in the review data collection share their ID with the reviewer they are associated with!
//There will be one review data document per reviewer which will store that reviewer's review data for a specific
//application response. For example, if reviewer with ID 1 was assigned to review an application response with 
//ID 5, the document in the review-data collection for that review assignment will have ID 1. This makes querying
//the review data collection a bit faster.

export async function getReviewDataForApplication(applicationId: string) {
  //TODO: fetch the associated review data for this application
}

export async function getReviewDataForApplicant(applicant: ApplicantUserProfile) {
  //TODO: fetch the associated review data for this applicant
}

export async function updateReviewData(applicationId: string) {
  //TODO: Implement! 
}
