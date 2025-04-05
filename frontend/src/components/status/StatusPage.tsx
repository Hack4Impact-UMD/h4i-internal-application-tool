import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Status } from '../../services/applicationStatus';
import { useState, useEffect } from 'react';
import { collection, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

import ProgressBar from './ProgressBar';
import StatusBox from './StatusBox';
import StatusTimeline from './ApplicationTimeline.tsx';
import ApplyingTimeline from './ApplyingTimeline.tsx';

interface Application {
    id: string;
    title: string;
    status: Status;
    dateSubmitted: Timestamp;
    applicationUrl: string;
}

function StatusPage() {
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const applicationsCollection = collection(db, 'applications');
                const applicationsSnapshot = await getDocs(applicationsCollection);
                const applicationsList = applicationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Application[];
                setApplications(applicationsList);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusDisplay = (status: Status) => {
        switch (status) {
            case Status.UNDER_REVIEW:
                return { text: 'Under review', className: 'bg-blue-100 text-blue-700' };
            case Status.ACCEPTED:
                return { text: 'Accept', className: 'bg-green-100 text-green-700' };
            case Status.REJECTED:
                return { text: 'Reject', className: 'bg-red-100 text-red-700' };
            case Status.SUBMITTED:
                return { text: 'Submitted', className: 'bg-yellow-100 text-yellow-700' };
            default:
                return { text: 'Ended', className: 'bg-gray-100 text-gray-700' };
        }
    };

    const formatDate = (timestamp: Timestamp) => {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        return '-';
    };

    const activeApplications = applications.filter(app => 
        [Status.SUBMITTED, Status.UNDER_REVIEW, Status.INTERVIEW_TBD, 
         Status.INTERVIEW_SCHEDULED, Status.INTERVIEW_COMPLETE].includes(app.status)
    );

    const inactiveApplications = applications.filter(app => 
        [Status.REJECTED, Status.ACCEPTED, Status.CONFIRMED, Status.DECLINED].includes(app.status)
    );


    const incompleteApplicationError = "Looks like you haven't submitted your application yet. Please submit when you're ready.";

    return (
        <>
            <Navbar isSignedIn={false} />
            <div className="flex flex-col w-full items-center p-8">
                <div className="flex flex-col w-full gap-5 font-bold max-w-5xl items-center">
                    <h1 className="text-4xl">
                        Current Application Status
                    </h1>

                    <ProgressBar
                        fillLevel={status} />

                    {status === 0 &&
                        <div className="max-w-96 px-4 text-center text-[1.4rem] text-red">
                            <p>
                                {incompleteApplicationError}
                            </p>
                        </div>}

                    {status > 0 &&
                        <StatusBox
                            status={status}
                            applicationUrl={applicationUrl} />}

                </div>
            </div>
        </>
    );
}

export default StatusPage;
