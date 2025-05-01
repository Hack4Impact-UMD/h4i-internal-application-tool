// src/components/reviewer/DataTable.tsx
import React from 'react';
import { Applicant } from '../../pages/ReviewDashboard';

const DataTable: React.FC<{ applicants: Applicant[] }> = ({ applicants }) => {
  const formatScore = (score: number | null | undefined) => {
    return score == null ? '-' : `${score.toFixed(2)}/4`;
  };

  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
      <table className="w-full table-auto text-left">
        <thead className="bg-white border-b border-gray-200 text-gray-600 text-sm">
          <tr>
            <th className="px-4 py-3 font-semibold">S.NO</th>
            <th className="px-6 py-3 font-semibold">Name</th>
            <th className="px-6 py-3 font-semibold">Role</th>
            <th className="px-6 py-3 font-semibold">Reviewer 1</th>
            <th className="px-6 py-3 font-semibold">Score 1</th>
            <th className="px-6 py-3 font-semibold">Reviewer 2</th>
            <th className="px-6 py-3 font-semibold">Score 2</th>
            <th className="px-6 py-3 font-semibold">Average Score</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6">
                No applicants found.
              </td>
            </tr>
          ) : (
            applicants.map((app, i) => (
              <tr key={app.id} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-6 py-4 text-[#333333] text-base">{app.name}</td>
                <td className="px-6 py-4">{app.roles[0]}</td>
                <td className="px-6 py-4">{app.reviewer1}</td>
                <td className="px-6 py-4">{formatScore(app.reviewerScore1)}</td>
                <td className="px-6 py-4">{app.reviewer2}</td>
                <td className="px-6 py-4">{formatScore(app.reviewerScore2)}</td>
                <td className="px-6 py-4">{formatScore(app.averageScore)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;