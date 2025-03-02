import { getDoc, doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../config/firebase';

export enum Status {
  INCOMPLETE = 0.0,
  SUBMITTED = 1.0,
  UNDER_REVIEW = 2.0,
  INTERVIEW_TBD = 3.0,
  INTERVIEW_SCHEDULED = 3.1,
  INTERVIEW_COMPLETE = 3.2,
  REJECTED = 4.0,
  ACCEPTED = 5.0,
  CONFIRMED = 5.1,
  DECLINED = 5.2
}

//return type
export interface ApplicationStatus {
  status: Status;
  dateReceived: string;
  applicationUrl: string;
}

export async function getApplicationStatus(applicationId: string): Promise<ApplicationStatus> {
  try {
    const applicationRef = doc(db, 'applications', applicationId); //references application in firebase
    const applicationSnap = await getDoc(applicationRef); //gets document

    //no application
    if (!applicationSnap.exists()) {
      throw new Error('Application not found');
    }

    const data = applicationSnap.data();
    return {
      status: data.status,
      dateReceived: data.dateReceived.toDate().toLocaleDateString(),
      applicationUrl: data.applicationUrl
    };
  } catch (error) {
    console.error('Error fetching application status:', error);
    throw error;
  }
}

export async function setApplicationStatus(applicationId: string, newStatus: Status): Promise<void> {
  try {
    const applicationRef = doc(db, 'applications', applicationId); //references application in firebase
    const applicationSnap = await getDoc(applicationRef); //gets document

    //no application
    if (!applicationSnap.exists()) {
      throw new Error('Application not found');
    }

    //updating the status
    await updateDoc(applicationRef, {
      status: newStatus,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}


