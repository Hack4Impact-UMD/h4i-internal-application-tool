import { Status } from '../../services/applicationStatus';
import { useState, useEffect } from 'react';
import { collection, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

import Timeline from "./Timeline.tsx";

interface Application {
    id: string;
    title: string;
    status: Status;
    dateSubmitted: Timestamp;
    applicationUrl: string;
}

const timelineItems = [
    { label: "About Yourself"},
    { label: "Resume" },
    { label: "More questions " },
    { label: "Review" },
  ];

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
        <div className="flex flex-col">
            <div className="h-screen bg-gray">
                <div className="bg-white p-6 w-full max-w-5xl mx-auto m-8">
                    <h1 className="text-xl mt-10 mb-10 font-semibold">
                        My Applications
                    </h1>

                    <div className="border-b border-gray-300">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`relative pb-4 px-1 ${
                                    activeTab === 'active'
                                        ? 'text-blue-500'
                                        : 'text-gray-500'
                                }`}
                                style={{ background: 'none', border: 'none', outline: 'none' }}
                            >
                                Active ({activeApplications.length})
                                {activeTab === 'active' && (
                                    <div className="absolute bottom-0 left-2 right-2 h-1.5 bg-blue-500 rounded-t-full" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('inactive')}
                                className={`relative pb-4 px-1 ${
                                    activeTab === 'inactive'
                                        ? 'text-blue-500'
                                        : 'text-gray-500'
                                }`}
                                style={{ background: 'none', border: 'none', outline: 'none' }}
                            >
                                Inactive ({inactiveApplications.length})
                                {activeTab === 'inactive' && (
                                    <div className="absolute bottom-0 left-2 right-2 h-1.5 bg-blue-500 rounded-t-full" />
                                )}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'active' && <Timeline currentStep={2} items={timelineItems} maxStepReached={2} />}

                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-gray-300">
                                    <th className="pb-4 pt-4 text-left font-normal w-1/3">Job Title</th>
                                    <th className="pb-4 pt-4 text-center font-normal w-1/4">Application Status</th>
                                    <th className="pb-4 pt-4 text-center font-normal w-1/4">Date Submitted</th>
                                    <th className="pb-4 pt-4 text-center font-normal w-1/6">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'active' ? activeApplications : inactiveApplications).map(application => (
                                    <tr key={application.id} className="border-t border-gray-300">
                                        <td className="py-4 text-blue-500 font-bold">{application.title}</td>
                                        <td className="text-center">
                                            <span className={`px-3 py-1 rounded-full ${getStatusDisplay(application.status).className}`}>
                                                {getStatusDisplay(application.status).text}
                                            </span>
                                        </td>
                                        <td className="text-center">{formatDate(application.dateSubmitted)}</td>
                                        <td className="text-center">
                                            {application.status >= Status.REJECTED ? (
                                                <span className="text-blue-500 cursor-pointer" 
                                                      onClick={() => window.open("/status/decision", "_self")}>
                                                    View Decision
                                                </span>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusPage;