import { DocumentData } from "firebase-admin/firestore"
import { db } from ".."
import { logger } from "firebase-functions"

async function upload(collection: string, id: string, data: DocumentData) {
  await db.collection(collection).doc(id).set(data)
}

export async function uploadMockData() {
  const data = {
    "applicationForms": [{ "id": "sample-form", "description": "A sample form for testing", "dueDate": "2026-02-01T05:00:00.000Z", "isActive": true, "semester": "Fall 2025", "sections": [{ "questions": [{ "questionType": "short-answer", "optional": false, "questionId": "q1", "questionText": "A simple question", "secondaryText": "Secondary text..." }, { "questionType": "long-answer", "optional": true, "questionId": "q2", "questionText": "Another simple question", "placeholderText": "foo", "minimumWordCount": 100, "maximumWordCount": 500 }, { "multipleSelect": true, "optional": false, "questionId": "q3", "questionText": "Multiple Selection", "questionOptions": ["Option 1", "Option 2", "Option 3"], "questionType": "multiple-select", "secondaryText": "Some secondary text..." }], "sectionName": "Section 1" }] }]
  }

  logger.info("Writing mock form to database...")
  await upload("application-forms", data["applicationForms"][0].id, data["applicationForms"][0])
  logger.info("Done writing mock data!")
}


