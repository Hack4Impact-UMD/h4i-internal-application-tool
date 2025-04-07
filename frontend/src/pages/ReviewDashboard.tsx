import { useEffect, useState } from 'react';
import ProgressBar from '../components/reviewer/ProgressBar';
import FilterBar from '../components/reviewer/FilterBar';
import DataTable from '../components/reviewer/DataTable';
import './ReviewDashboard.css';
import { Timestamp } from 'firebase/firestore';

export type Applicant = {
  id: string;
  name: string;
  email: string;
  status: string;
  dateApplied: Timestamp;
  roles: string[];
  interestInClubScore: number | null;
  interestInSocialGoodScore: number | null;
  technicalExpertiseScore: number | null;
  npoExpertiseScore: number | null;
  communicationScore: number | null;
  overallScore: number | null;
  reviewer1: string;
  reviewerScore1: number | null; 
  reviewer2: string;
  reviewerScore2: number | null;
  totalScore: number | null;
};

function ReviewDashboard() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);

  const calculateOverallScore = (applicant: Applicant): number | null => {
    const role = applicant.roles[0]?.toLowerCase();

    if (role === 'bootcamp') {
      if (applicant.interestInClubScore === null || applicant.interestInSocialGoodScore === null) {
        return null;
      }
      return (0.5 * applicant.interestInClubScore) + (0.5 * applicant.interestInSocialGoodScore);
    }

    else if (role === 'sourcing') {
      if (
        applicant.interestInClubScore === null ||
        applicant.interestInSocialGoodScore === null ||
        applicant.npoExpertiseScore === null ||
        applicant.communicationScore === null
      ) {
        return null;
      }
      return (
        (0.3 * applicant.interestInClubScore) +
        (0.3 * applicant.interestInSocialGoodScore) +
        (0.3 * applicant.npoExpertiseScore) +
        (0.1 * applicant.communicationScore)
      );
    }

    else if (['engineer', 'tl', 'pm', 'technical lead', 'designer', 'product'].includes(role)) {
      if (
        applicant.interestInClubScore === null ||
        applicant.interestInSocialGoodScore === null ||
        applicant.technicalExpertiseScore === null
      ) {
        return null;
      }
      return (
        (0.25 * applicant.interestInClubScore) +
        (0.2 * applicant.interestInSocialGoodScore) +
        (0.55 * applicant.technicalExpertiseScore)
      );
    }

    return null;
  };

  useEffect(() => {
    const dummyApplicants: Applicant[] = [
      {
        id: '1',
        name: 'America Ferrera',
        email: 'america@example.com',
        status: 'submitted',
        dateApplied: Timestamp.fromDate(new Date('2024-03-01')),
        roles: ['designer'],
        interestInClubScore: 4.5,
        interestInSocialGoodScore: 3.8,
        technicalExpertiseScore: 4.7,
        npoExpertiseScore: 3.0,
        communicationScore: 4.2,
        overallScore: null,
      },
      {
        id: '2',
        name: 'Bob Dylan',
        email: 'bob@example.com',
        status: 'in-review',
        dateApplied: Timestamp.fromDate(new Date('2024-02-15')),
        roles: ['technical lead'],
        interestInClubScore: 4.0,
        interestInSocialGoodScore: 4.5,
        technicalExpertiseScore: 3.9,
        npoExpertiseScore: 4.1,
        communicationScore: 4.3,
        overallScore: null,
      },
      {
        id: '3',
        name: 'Cara Delevingne',
        email: 'cara@example.com',
        status: 'in-review',
        dateApplied: Timestamp.fromDate(new Date('2025-02-13')),
        roles: ['bootcamp'],
        interestInClubScore: 4.0,
        interestInSocialGoodScore: 4.5,
        technicalExpertiseScore: 3.9,
        npoExpertiseScore: 4.1,
        communicationScore: 4.3,
        overallScore: null,
      },
      {
        id: '4',
        name: 'Drew Starkey',
        email: 'drew@example.com',
        status: 'in-review',
        dateApplied: Timestamp.fromDate(new Date('2024-12-25')),
        roles: ['product'],
        interestInClubScore: 4.0,
        interestInSocialGoodScore: 4.5,
        technicalExpertiseScore: 3.9,
        npoExpertiseScore: 4.1,
        communicationScore: 4.3,
        overallScore: null,
      },
    ];

    const applicantsWithScores = dummyApplicants.map(applicant => {
      const calculatedScore = calculateOverallScore(applicant);
      return {
        ...applicant,
        overallScore: calculatedScore !== null ? parseFloat(calculatedScore.toFixed(2)) : null
      };
    });

    setApplicants(applicantsWithScores);
    setAllApplicants(applicantsWithScores);
    setFilteredApplicants(applicantsWithScores);
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    filterApplicants(query, selectedRole);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    filterApplicants(search, role);
  };

  const finalizedApplicants = applicants.filter((applicant) => {
    return ![
      'App. Completed',
      'Interview Conducted',
      'Interview Offered',
    ].includes(applicant.status);
  });

  const filterApplicants = (query: string, role: string) => {
    const filtered = applicants.filter((applicant) => {
      const matchesQuery = applicant.name.toLowerCase().includes(query.toLowerCase()) ||
        applicant.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role ? applicant.roles.includes(role) : true;
      return matchesQuery && matchesRole;
    });
    setFilteredApplicants(filtered);
  };

  const handleSortChange = (sortType: string) => {
    const sortedApplicants = [...filteredApplicants];

    switch (sortType) {
      case "date":
        sortedApplicants.sort((a, b) => b.dateApplied.toDate().getTime() - a.dateApplied.toDate().getTime());
        break;
      case "name":
        sortedApplicants.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "score_high":
        sortedApplicants.sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0));
        break;
      case "score_low":
        sortedApplicants.sort((a, b) => (a.overallScore ?? 0) - (b.overallScore ?? 0));
        break;
      default:
        return;
    }

    setFilteredApplicants(sortedApplicants);
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen p-8 font-karla">

      <h1 className="text-2xl font-bold text-[#333333] mb-6">Applicant Reviewer Portal</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-[#D9F3FF] p-4 rounded-xl">
          <p className="text-[#1B3C59] text-sm font-medium">Number of Applicants</p>
          <p className="text-[#1B3C59] text-2xl font-bold">{allApplicants.length}</p>
        </div>
        <div className="flex-1 bg-[#D9FFEC] p-4 rounded-xl">
          <p className="text-[#1B3C59] text-sm font-medium">Applicants Reviewed</p>
          <p className="text-[#1B3C59] text-2xl font-bold">{finalizedApplicants.length}</p>
        </div>
        <div className="flex-1 bg-[#FFE5DA] p-4 rounded-xl">
          <p className="text-[#1B3C59] text-sm font-medium">Applicants Pending</p>
          <p className="text-[#1B3C59] text-2xl font-bold">{allApplicants.length - finalizedApplicants.length}</p>
        </div>
      </div>

      <FilterBar
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onRoleFilter={handleRoleFilter}
        selectedRole={selectedRole}
      />

      {loading ? (
        <p>Loading applicants...</p>
      ) : (
        <DataTable applicants={filteredApplicants} />
      )}
    </div>
  );
}

export default ReviewDashboard;
