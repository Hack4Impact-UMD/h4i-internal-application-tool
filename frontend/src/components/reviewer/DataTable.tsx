import React from 'react';
import { Applicant } from '../../pages/ReviewDashboard';

const roleColors: { [key: string]: string } = {
  designer: 'bg-[#FFE4B5] text-[#E07C00]',
  'technical lead': 'bg-[#C9F3FF] text-[#00A9E0]',
  'product manager': 'bg-[#EBD2FF] text-[#9B59B6]',
  engineer: 'bg-[#FEF5C3] text-[#8B6C00]',
  sourcing: 'bg-[#CEF3EA] text-[#00A9A0]',
  bootcamp: 'bg-[#FFD6D6] text-[#D60E0E]',
};

const DataTable: React.FC<{ applicants: Applicant[] }> = ({ applicants }) => {
  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return '-';
    // If your scores are out of 12, append "/12".
    return `${score}/12`;
  };

  const getRoleBadge = (role: string) => {
    const key = role.toLowerCase();
    const badgeColor = roleColors[key] || 'bg-gray-200 text-gray-800';
    return (
      <span className={`text-sm px-3 py-1 rounded-full font-medium ${badgeColor}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="mt-4 rounded-xl overflow-hidden shadow border border-gray-200">
      <table className="w-full table-auto text-left">
        <thead className="bg-white border-b border-gray-200 text-gray-600 text-sm">
          <tr>
            <th className="px-4 py-3 font-semibold">S.NO</th>
            <th className="px-6 py-3 font-semibold">Name</th>
            <th className="px-6 py-3 font-semibold">Roles</th>
            <th className="px-6 py-3 font-semibold">Reviewer 1</th>
            <th className="px-6 py-3 font-semibold">Score 1</th>
            <th className="px-6 py-3 font-semibold">Reviewer 2</th>
            <th className="px-6 py-3 font-semibold">Score 2</th>
            {/* Application Score last */}
            <th className="px-6 py-3 font-semibold">Application Score</th>
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
            applicants.map((applicant, index) => (
              <tr key={applicant.id} className="bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-6 py-4 text-[#333333] text-base font-normal">
                  {applicant.name}
                </td>
                <td className="px-6 py-4">
                  {getRoleBadge(applicant.roles[0])}
                </td>
                <td className="px-6 py-4">{applicant.reviewer1}</td>
                <td className="px-6 py-4">
                  {applicant.reviewerScore1 != null
                    ? formatScore(applicant.reviewerScore1)
                    : '-'}
                </td>
                <td className="px-6 py-4">{applicant.reviewer2}</td>
                <td className="px-6 py-4">
                  {applicant.reviewerScore2 != null
                    ? formatScore(applicant.reviewerScore2)
                    : '-'}
                </td>
                <td className="px-6 py-4 font-semibold text-[#333333]">
                  {applicant.overallScore != null
                    ? formatScore(applicant.overallScore)
                    : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
