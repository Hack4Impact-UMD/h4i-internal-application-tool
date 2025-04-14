import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
// import FilterBar from '../components/reviewer/FilterBar'; // <-- Commented out per your instructions
import DataTable from '../components/reviewer/DataTable';
import './ReviewDashboard.css';

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
  // Reviewer information
  reviewer1: string;
  reviewer2: string;
  reviewerScore1: number | null;
  reviewerScore2: number | null;
};

function ReviewDashboard() {
  // State for the selected role and name search
  const [selectedRole, setSelectedRole] = useState('');
  const [search, setSearch] = useState('');

  // List of all applicants and filtered ones
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);

  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------------
  // Dummy Data with reviewer details
  // ------------------------------------------------------------------
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
        reviewer1: 'Hannah Montana',
        reviewer2: 'Elon Tusk',
        reviewerScore1: 9.0,
        reviewerScore2: 8.5,
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
        reviewer1: 'Kate Bush',
        reviewer2: 'Beyonce Knowles',
        reviewerScore1: 10.0,
        reviewerScore2: 9.5,
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
        reviewer1: 'Ryan Gosling',
        reviewer2: 'Natalie Portman',
        reviewerScore1: 6.5,
        reviewerScore2: 7.0,
      },
      {
        id: '4',
        name: 'Drew Starkey',
        email: 'drew@example.com',
        status: 'in-review',
        dateApplied: Timestamp.fromDate(new Date('2024-12-25')),
        roles: ['product manager'],
        interestInClubScore: 4.0,
        interestInSocialGoodScore: 4.5,
        technicalExpertiseScore: 3.9,
        npoExpertiseScore: 4.1,
        communicationScore: 4.3,
        overallScore: null,
        reviewer1: 'Tom Riddle',
        reviewer2: 'Taylor Swift',
        reviewerScore1: 8.7,
        reviewerScore2: 9.0,
      },
      {
        id: '5',
        name: 'Eva Green',
        email: 'eva@example.com',
        status: 'in-review',
        dateApplied: Timestamp.fromDate(new Date('2024-11-11')),
        roles: ['engineer'],
        interestInClubScore: 3.5,
        interestInSocialGoodScore: 4.0,
        technicalExpertiseScore: 4.9,
        npoExpertiseScore: 3.9,
        communicationScore: 3.8,
        overallScore: null,
        reviewer1: 'John Snow',
        reviewer2: 'Arya Stark',
        reviewerScore1: 7.5,
        reviewerScore2: 8.3,
      },
      {
        id: '6',
        name: 'Finn Wolfhard',
        email: 'finn@example.com',
        status: 'submitted',
        dateApplied: Timestamp.fromDate(new Date('2025-01-02')),
        roles: ['sourcing'],
        interestInClubScore: 4.2,
        interestInSocialGoodScore: 4.1,
        technicalExpertiseScore: 3.0,
        npoExpertiseScore: 4.4,
        communicationScore: 4.0,
        overallScore: null,
        reviewer1: 'Dua Lipa',
        reviewer2: 'Shawn Mendes',
        reviewerScore1: 8.0,
        reviewerScore2: 8.1,
      },
    ];

    // Calculate overall scores for each applicant
    const applicantsWithScores = dummyApplicants.map(applicant => ({
      ...applicant,
      overallScore: calculateOverallScore(applicant),
    }));

    setApplicants(applicantsWithScores);
    setFilteredApplicants(applicantsWithScores);
  }, []);

  // ------------------------------------------------------------------
  // Overall score calculation logic
  // ------------------------------------------------------------------
  const calculateOverallScore = (applicant: Applicant): number | null => {
    const role = applicant.roles[0]?.toLowerCase();
    if (role === 'bootcamp') {
      if (applicant.interestInClubScore == null || applicant.interestInSocialGoodScore == null)
        return null;
      return (
        0.5 * applicant.interestInClubScore +
        0.5 * applicant.interestInSocialGoodScore
      );
    } else if (role === 'sourcing') {
      if (
        applicant.interestInClubScore == null ||
        applicant.interestInSocialGoodScore == null ||
        applicant.npoExpertiseScore == null ||
        applicant.communicationScore == null
      )
        return null;
      return (
        0.3 * applicant.interestInClubScore +
        0.3 * applicant.interestInSocialGoodScore +
        0.3 * applicant.npoExpertiseScore +
        0.1 * applicant.communicationScore
      );
    } else if (
      [
        'engineer',
        'tl',
        'pm',
        'technical lead',
        'designer',
        'product manager',
        'product',
      ].includes(role)
    ) {
      if (
        applicant.interestInClubScore == null ||
        applicant.interestInSocialGoodScore == null ||
        applicant.technicalExpertiseScore == null
      )
        return null;
      return (
        0.25 * applicant.interestInClubScore +
        0.2 * applicant.interestInSocialGoodScore +
        0.55 * applicant.technicalExpertiseScore
      );
    }
    return null;
  };

  // ------------------------------------------------------------------
  // Unified filter logic (filter by role and by search query)
  // ------------------------------------------------------------------
  const filterApplicants = (role: string, query: string) => {
    const filtered = applicants.filter(app => {
      const matchesRole = role
        ? app.roles.map(r => r.toLowerCase()).includes(role.toLowerCase())
        : true;
      const matchesQuery = app.name.toLowerCase().includes(query.toLowerCase());
      return matchesRole && matchesQuery;
    });
    setFilteredApplicants(filtered);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    filterApplicants(role, search);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    filterApplicants(selectedRole, query);
  };

  // ------------------------------------------------------------------
  // Role-based counts for top filter boxes
  // ------------------------------------------------------------------
  const roleCounts: Record<string, number> = {
    'product manager': 0,
    designer: 0,
    'technical lead': 0,
    engineer: 0,
    sourcing: 0,
    bootcamp: 0,
  };
  applicants.forEach(a => {
    const r = a.roles[0]?.toLowerCase();
    if (r && roleCounts[r] !== undefined) {
      roleCounts[r]++;
    }
  });
  const totalApplicantsCount = applicants.length;

  // Update the top boxes data structure so that each box renders as a card
  const topBoxes = [
    {
      category: 'Total Applicants',
      count: totalApplicantsCount,
      roleKey: '',
      defaultBg: 'bg-[#FCEDEA]',
      defaultText: 'text-[#AD6042]',
      selectedBg: 'bg-[#AD6042]',
      selectedText: 'text-white',
    },
    {
      category: 'Product Managers',
      count: roleCounts['product manager'] || 0,
      roleKey: 'product manager',
      defaultBg: 'bg-[#ECFDF5]',
      defaultText: 'text-[#056041]',
      selectedBg: 'bg-[#056041]',
      selectedText: 'text-white',
    },
    {
      category: 'Designer',
      count: roleCounts['designer'] || 0,
      roleKey: 'designer',
      defaultBg: 'bg-[#FDF2FA]',
      defaultText: 'text-[#9D174D]',
      selectedBg: 'bg-[#9D174D]',
      selectedText: 'text-white',
    },
    {
      category: 'Tech Lead',
      count: roleCounts['technical lead'] || 0,
      roleKey: 'technical lead',
      defaultBg: 'bg-[#F4F3FF]',
      defaultText: 'text-[#4433B8]',
      selectedBg: 'bg-[#4433B8]',
      selectedText: 'text-white',
    },
    {
      category: 'Engineer',
      count: roleCounts['engineer'] || 0,
      roleKey: 'engineer',
      defaultBg: 'bg-[#FFF7EC]',
      defaultText: 'text-[#854D0E]',
      selectedBg: 'bg-[#854D0E]',
      selectedText: 'text-white',
    },
    {
      category: 'Sourcing',
      count: roleCounts['sourcing'] || 0,
      roleKey: 'sourcing',
      defaultBg: 'bg-[#F0FDFA]',
      defaultText: 'text-[#115E59]',
      selectedBg: 'bg-[#115E59]',
      selectedText: 'text-white',
    },
    {
      category: 'Bootcamp',
      count: roleCounts['bootcamp'] || 0,
      roleKey: 'bootcamp',
      defaultBg: 'bg-[#FAF5FF]',
      defaultText: 'text-[#6D28D9]',
      selectedBg: 'bg-[#6D28D9]',
      selectedText: 'text-white',
    },
  ];

  return (
    <div className="bg-[#F7F7F7] min-h-screen p-8 font-karla">
      {/* Centered heading with search bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#333333] text-center">
          Director of Recruitment Dashboard
        </h1>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
      </div>

      {/* Top role filter boxes rendered as cards */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {topBoxes.map((box, index) => {
          const isSelected =
            selectedRole.toLowerCase() === box.roleKey.toLowerCase();
          return (
            <button
              key={index}
              onClick={() => handleRoleFilter(box.roleKey)}
              className={`
                rounded-lg shadow-lg flex flex-col items-center justify-center
                w-32 h-24 p-4 transition-colors
                ${isSelected ? box.selectedBg : box.defaultBg}
                ${isSelected ? box.selectedText : box.defaultText}
              `}
            >
              <div className="text-2xl font-bold">{box.count}</div>
              <div className="text-sm mt-1">{box.category}</div>
            </button>
          );
        })}
      </div>

      {/*
      <FilterBar
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onRoleFilter={handleRoleFilter}
        selectedRole={selectedRole}
      />
      */}

      {loading ? (
        <p>Loading applicants...</p>
      ) : (
        <DataTable applicants={filteredApplicants} />
      )}
    </div>
  );
}

export default ReviewDashboard;
