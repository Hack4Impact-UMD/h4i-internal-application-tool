import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';

import Timeline from "./Timeline.tsx";
import { useApplicationResponses } from '../../hooks/useApplicationResponses.ts';
import { ApplicationResponse, ApplicationStatus } from '../../types/types.ts';
import { useApplicationForm } from '../../hooks/useApplicationForm.ts';


const timelineItems = [
    { label: "About Yourself" },
    { label: "Resume" },
    { label: "More questions " },
    { label: "Review" },
];


function ApplicationResponseRow({ response }: { response: ApplicationResponse }) {
    const { data: form, isLoading, error } = useApplicationForm(response.applicationFormId)

    if (isLoading) {
        return <tr className="w-full border-t border-gray-300">
            <p>Loading...</p>
        </tr>
    }

    if (error) {
        return <tr className="w-full border-t border-gray-300">
            <p className="text-red-600">Failed to fetch application form: {error.message}</p>
        </tr>
    }

    const getStatusDisplay = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.UnderReview:
                return { text: 'Under review', className: 'bg-blue-100 text-blue-700' };
            case ApplicationStatus.Decided:
                return { text: 'Decided', className: 'bg-green-100 text-green-700' };
            case ApplicationStatus.Interview:
                return { text: 'Interview', className: 'bg-yellow-100 text-yellow-700' };
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

    return <tr className="border-t border-gray-300">
        <td className="py-4 text-blue-500 font-bold">{form!.semester}</td>
        <td className="text-center">
            <span className={`px-3 py-1 rounded-full ${getStatusDisplay(response.status).className}`}>
                {getStatusDisplay(response.status).text}
            </span>
        </td>
        <td className="text-center">{formatDate(response!.dateSubmitted)}</td>
        <td className="text-center">
            {response.status == ApplicationStatus.Decided ? (
                <span className="text-blue-500 cursor-pointer"
                    onClick={() => window.open("/status/decision", "_self")}>
                    View Decision
                </span>
            ) : '-'}
        </td>
    </tr>
}

function StatusPage() {
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const { data: applications, isLoading, error } = useApplicationResponses()

    const activeApplications = applications.filter(app =>
        [ApplicationStatus.UnderReview, ApplicationStatus.Interview].includes(app.status)
    );

    const inactiveApplications = applications.filter(app =>
        [ApplicationStatus.InActive].includes(app.status)
    );

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
                                className={`relative pb-4 px-1 cursor-pointer ${activeTab === 'active'
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
                                className={`relative pb-4 px-1 cursor-pointer ${activeTab === 'inactive'
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
                                {isLoading ?
                                    <p>Loading...</p> :
                                    error ? <p>Error fetching applications: {error.message}</p> :
                                        (activeTab === 'active' ? activeApplications : inactiveApplications).map(application => (
                                            <ApplicationResponseRow key={application.id} response={application} />
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusPage;
