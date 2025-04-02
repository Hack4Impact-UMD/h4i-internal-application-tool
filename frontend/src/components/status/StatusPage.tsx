import { Status } from '../../services/applicationStatus';
import { useState } from 'react';

import Navbar from './Navbar';
import ProgressBar from './ProgressBar';
import StatusBox from './StatusBox';

function StatusPage() {
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    
    // TODO: Get these fields from the centralized state
    const status = Status.ACCEPTED;
    const applicationUrl = "/";

    const incompleteApplicationError = "Looks like you haven't submitted your application yet. Please submit when you're ready.";

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Navbar isSignedIn={false} />
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
                                Active (1)
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
                                Inactive (3)
                                {activeTab === 'inactive' && (
                                    <div className="absolute bottom-0 left-2 right-2 h-1.5 bg-blue-500 rounded-t-full" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* <ProgressBar
                        fillLevel={4} /> */}

                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-gray-300">
                                    <th className="pb-4 pt-4 text-left font-normal">Job Title</th>
                                    <th className="pb-4 pt-4 text-center font-normal">Application Status</th>
                                    <th className="pb-4 pt-4 text-center font-normal">Date Submitted</th>
                                    <th className="pb-4 pt-4 text-center font-normal">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'active' ? (
                                    <tr className="border-t border-gray-300">
                                        <td className="py-4 text-blue-500">Hack4Impact Spring 2025 Application</td>
                                        <td className="text-center"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Under review</span></td>
                                        <td className="text-center">Mar 10, 2025</td>
                                        <td className="text-center">-</td>
                                    </tr>
                                ) : (
                                    <>
                                        <tr className="border-t border-gray-300">
                                            <td className="py-4">Hack4Impact Spring 2024 Application</td>
                                            <td className="text-center"><span className="bg-gray-100 px-3 py-1 rounded-full">Ended</span></td>
                                            <td className="text-center">Feb 10, 2024</td>
                                            <td className="text-center text-blue-500">View Decision</td>
                                        </tr>
                                        <tr className="border-t border-gray-300">
                                            <td className="py-4">Hack4Impact Spring 2023 Application</td>
                                            <td className="text-center"><span className="bg-gray-100 px-3 py-1 rounded-full">Accept</span></td>
                                            <td className="text-center">Mar 21, 2023</td>
                                            <td className="text-center">-</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StatusPage;
