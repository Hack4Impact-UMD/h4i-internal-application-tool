import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';

import Timeline from "./Timeline.tsx";
import { ApplicationResponse, ApplicationStatus } from '../../types/types.ts';
import { useApplicationResponsesAndSemesters } from '../../hooks/useApplicationResponseAndSemesters.tsx';


const timelineItems = [
    { label: "About Yourself" },
    { label: "Resume" },
    { label: "More questions " },
    { label: "Review" },
];


function ApplicationResponseRow({ response }: { response: ApplicationResponse }) {
    const getStatusDisplay = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.Submitted:
                return { text: 'Submitted', className: 'bg-blue-100 text-gray-700' };
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
        <td className="py-4 text-blue-500 font-bold">{response.rolesApplied.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(", ")}</td>
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
    // replace this hook call with new call
    const { data: applications, isLoading, error } = useApplicationResponsesAndSemesters()

    const activeApplications = applications.filter(app =>
        [ApplicationStatus.Submitted, ApplicationStatus.UnderReview, ApplicationStatus.Interview].includes(app.status)
    );

    const inactiveApplications = applications.filter(app =>
        [ApplicationStatus.InActive].includes(app.status)
    );

    const activeList = (activeTab == "active") ? activeApplications : inactiveApplications
    const semesterGrouping = activeList.reduce((map, application) => {
        const semester = application.semester

        if (!map.has(semester)) {
            map.set(semester, []);
        }

        map.get(semester)!.push(application);
        return map;
    }, new Map<string, ApplicationResponse[]>()
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

                    <div className="mt-5">
                        {activeTab === 'active' && <Timeline currentStep={2} items={timelineItems} maxStepReached={2} />}
                    </div>

                    <div className="mt-3">
                        {isLoading ?
                            <p className="w-full">Loading...</p> :
                            error ? <p className="w-full">Error fetching applications: {error.message}</p> :
                                activeList.length == 0 ? <p className="w-full">You don't have any {activeTab} applications. Go apply!</p> :
                                    (activeTab == "inactive") ? (Array.from(semesterGrouping.entries()).map(([semester, apps]) => (
                                        <div>
                                            <h2 className="text-lg font-semibold mt-6 mb-2">Hack4Impact {semester} Application</h2>
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
                                                    {apps.map((application) => (
                                                        <ApplicationResponseRow key={application.id} response={application} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))
                                    ) : (<table className="w-full">
                                        <thead>
                                            <tr className="border-t border-gray-300">
                                                <th className="pb-4 pt-4 text-left font-normal w-1/3">Job Title</th>
                                                <th className="pb-4 pt-4 text-center font-normal w-1/4">Application Status</th>
                                                <th className="pb-4 pt-4 text-center font-normal w-1/4">Date Submitted</th>
                                                <th className="pb-4 pt-4 text-center font-normal w-1/6">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeList.map(application => (
                                                <ApplicationResponseRow key={application.id} response={application} />
                                            ))}
                                        </tbody>
                                    </table>)}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default StatusPage;
