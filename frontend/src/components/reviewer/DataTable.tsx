import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Applicant } from '../../pages/ReviewDashboard';

type Props = {
    applicants: Applicant[] //change
}

const thClasses = "bg-white border border-[#69778780] p-[8px] text-left font-bold";
const tableCellClasses = "border-0 p-[8px] text-left overflow-hidden text-ellipsis last:text-right bg-gray-100 hover:bg-gray-300";

const DataTable: React.FC<Props> = ({ applicants }: Props) => {
    const navigate = useNavigate();

    const handleRowClick = (id: string) => {
        navigate(`/admin/applicant/${id}`);
    };

    const formatDate = (timestamp: Timestamp) => {
        if (timestamp && timestamp.toDate) {
            const date = timestamp.toDate();
            return date.toLocaleDateString();
        }
        return '-';
    };

    return (
        <table className="w-[112%] border-collapse border border-gray-200 ml-[-80px] table-fixed">
            <thead>
                <tr>
                    <th className={thClasses}>Name</th>
                    <th className={thClasses}>Email</th>
                    <th className={thClasses}>Status</th>
                    <th className={thClasses}>Date Applied</th>
                    <th className={thClasses}>Role(s)</th>
                    <th className={thClasses}>Application Score</th>
                    <th className={thClasses}>Interview Score</th>
                    <th className={thClasses}>Overall Score</th>
                </tr>
            </thead>
            <tbody>
                {applicants.map((applicant: Applicant) => (
                    <tr key={applicant.id}
                        onClick={() => handleRowClick(applicant.id)}
                        className="cursor-pointer"
                    >
                        <td className={tableCellClasses}>{applicant.name}</td>
                        <td className={tableCellClasses}>{applicant.email}</td>
                        <td className={tableCellClasses}>{applicant.status}</td>
                        <td className={tableCellClasses}>{formatDate(applicant.dateApplied)}</td>
                        <td className={tableCellClasses}>{applicant.roles.join(', ')}</td>
                        <td className={tableCellClasses}>{applicant.applicationScore || '-'}</td>
                        <td className={tableCellClasses}>{applicant.interviewScore || '-'}</td>
                        <td className={tableCellClasses}>{applicant.applicationScore ?? "-" + applicant.interviewScore}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
