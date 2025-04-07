
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Applicant } from '../../pages/ReviewDashboard';
import { Pencil } from 'lucide-react';

const roleColors: { [key: string]: string } = {
  designer: 'bg-[#FFE4B5] text-[#E07C00]',
  'technical lead': 'bg-[#C9F3FF] text-[#00A9E0]',
  'project manager': 'bg-[#EBD2FF] text-[#9B59B6]',
};

const DataTable: React.FC<{ applicants: Applicant[] }> = ({ applicants }) => {
  const navigate = useNavigate();

  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return '-';
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
            <th className="px-6 py-3 font-semibold">Name</th>
            <th className="px-6 py-3 font-semibold">Role</th>
            <th className="px-6 py-3 font-semibold">Application Score</th>
            <th className="px-6 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.id} className="bg-gray-50 hover:bg-gray-100">
              <td className="px-6 py-4 text-[#333333] text-base font-normal">
                {applicant.name}
              </td>
              <td className="px-6 py-4">
                {getRoleBadge(applicant.roles[0])}
              </td>
              <td className="px-6 py-4 font-semibold text-[#333333]">
                {formatScore(applicant.overallScore)}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  className="bg-[#F5F5F5] px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-gray-300"
                  onClick={() => navigate(`/admin/applicant/${applicant.id}`)}
                >
                  <Pencil size={16} /> Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
