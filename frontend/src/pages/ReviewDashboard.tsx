
import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
// import FilterBar from '../components/reviewer/FilterBar'; 
import DataTable from '../components/reviewer/DataTable';
import './ReviewDashboard.css';
import { getAllApplicants } from '../services/applicantService';

export type ReviewerScores = {
  interestInClubScore: number | null;
  interestInSocialGoodScore: number | null;
  technicalExpertiseScore?: number | null;
  npoExpertiseScore?: number | null;
  communicationScore?: number | null;
};

export type Applicant = {
  id: string;
  name: string;
  email: string;
  status: string;
  dateApplied: Timestamp;
  roles: string[];
  reviewer1: string;
  reviewer2: string;
  reviewer1Scores: ReviewerScores;
  reviewer2Scores: ReviewerScores;
  reviewerScore1: number | null;
  reviewerScore2: number | null;
  averageScore: number | null;
};

function ReviewDashboard() {
  const [selectedRole, setSelectedRole] = useState('');
  const [search, setSearch] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading] = useState(false);

  const calculateScore = (role: string, s: ReviewerScores): number | null => {
    role = role.toLowerCase();
    const ic = s.interestInClubScore, isg = s.interestInSocialGoodScore;
    const te = s.technicalExpertiseScore, ne = s.npoExpertiseScore, c = s.communicationScore;
    if (role === 'bootcamp') {
      if (ic == null || isg == null) return null;
      return 0.5 * ic + 0.5 * isg;
    } else if (role === 'sourcing') {
      if (ic == null || isg == null || ne == null || c == null) return null;
      return 0.3 * ic + 0.3 * isg + 0.3 * ne + 0.1 * c;
    } else if (['engineer','tl','pm','technical lead','designer','product manager','product'].includes(role)) {
      if (ic == null || isg == null || te == null) return null;
      return 0.25 * ic + 0.2 * isg + 0.55 * te;
    }
    return null;
  };

  useEffect(() => {
    // let dummy: Omit<Applicant, 'reviewerScore1' | 'reviewerScore2' | 'averageScore'>[] = [];
    let dummy: Applicant[]=[];
    async function putApplicants(){
      try{
        const apps = await getAllApplicants() as unknown as Applicant[];
        if (apps.length>0){
          dummy=apps
        }
        else{
          dummy =[
          {
            id: '1',
            name: 'Unknown',
            email: 'america@example.com',
            status: 'submitted',
            dateApplied: Timestamp.fromDate(new Date('2024-03-01')),
            roles: ['engineer'],
            reviewer1: 'One',
            reviewer2: 'Two',
            reviewer1Scores: {
              interestInClubScore: 0.0,
              interestInSocialGoodScore: 0.0,
              technicalExpertiseScore: 0.0,
            },
            reviewer2Scores: {
              interestInClubScore: 0.0,
              interestInSocialGoodScore: 0.0,
              technicalExpertiseScore: 0.0,
            },
            reviewerScore1: null,
            reviewerScore2: null,
            averageScore: null
          }]
        }
      } catch{
        console.error("Error fetching applicants:");
      }
    }
        
    putApplicants();
    // let dummy = getAllApplicants();
    //   {
    //     id: '1',
    //     name: 'America Ferrera',
    //     email: 'america@example.com',
    //     status: 'submitted',
    //     dateApplied: Timestamp.fromDate(new Date('2024-03-01')),
    //     roles: ['designer'],
    //     reviewer1: 'Hannah Montana',
    //     reviewer2: 'Elon Tusk',
    //     reviewer1Scores: {
    //       interestInClubScore: 3.5,
    //       interestInSocialGoodScore: 3.8,
    //       technicalExpertiseScore: 3.7,
    //     },
    //     reviewer2Scores: {
    //       interestInClubScore: 3.8,
    //       interestInSocialGoodScore: 3.5,
    //       technicalExpertiseScore: 4.0,
    //     },
    //   },
    //   {
    //     id: '2',
    //     name: 'Bob Dylan',
    //     email: 'bob@example.com',
    //     status: 'in-review',
    //     dateApplied: Timestamp.fromDate(new Date('2024-02-15')),
    //     roles: ['technical lead'],
    //     reviewer1: 'Kate Bush',
    //     reviewer2: 'Beyoncé Knowles',
    //     reviewer1Scores: {
    //       interestInClubScore: 4.0,
    //       interestInSocialGoodScore: 3.9,
    //       technicalExpertiseScore: 3.5,
    //     },
    //     reviewer2Scores: {
    //       interestInClubScore: 3.7,
    //       interestInSocialGoodScore: 4.0,
    //       technicalExpertiseScore: 3.8,
    //     },
    //   },
    //   {
    //     id: '3',
    //     name: 'Cara Delevingne',
    //     email: 'cara@example.com',
    //     status: 'in-review',
    //     dateApplied: Timestamp.fromDate(new Date('2025-02-13')),
    //     roles: ['bootcamp'],
    //     reviewer1: 'Ryan Gosling',
    //     reviewer2: 'Natalie Portman',
    //     reviewer1Scores: {
    //       interestInClubScore: 3.9,
    //       interestInSocialGoodScore: 3.6,
    //     },
    //     reviewer2Scores: {
    //       interestInClubScore: 3.7,
    //       interestInSocialGoodScore: 3.8,
    //     },
    //   },
    //   {
    //     id: '4',
    //     name: 'Drew Starkey',
    //     email: 'drew@example.com',
    //     status: 'in-review',
    //     dateApplied: Timestamp.fromDate(new Date('2024-12-25')),
    //     roles: ['product manager'],
    //     reviewer1: 'Tom Riddle',
    //     reviewer2: 'Taylor Swift',
    //     reviewer1Scores: {
    //       interestInClubScore: 4.0,
    //       interestInSocialGoodScore: 3.8,
    //       technicalExpertiseScore: 3.9,
    //     },
    //     reviewer2Scores: {
    //       interestInClubScore: 3.9,
    //       interestInSocialGoodScore: 4.0,
    //       technicalExpertiseScore: 4.1,
    //     },
    //   },
    //   {
    //     id: '5',
    //     name: 'Eva Green',
    //     email: 'eva@example.com',
    //     status: 'in-review',
    //     dateApplied: Timestamp.fromDate(new Date('2024-11-11')),
    //     roles: ['engineer'],
    //     reviewer1: 'John Snow',
    //     reviewer2: 'Arya Stark',
    //     reviewer1Scores: {
    //       interestInClubScore: 3.5,
    //       interestInSocialGoodScore: 3.9,
    //       technicalExpertiseScore: 4.2,
    //     },
    //     reviewer2Scores: {
    //       interestInClubScore: 3.7,
    //       interestInSocialGoodScore: 4.0,
    //       technicalExpertiseScore: 4.1,
    //     },
    //   },
    //   {
    //     id: '6',
    //     name: 'Finn Wolfhard',
    //     email: 'finn@example.com',
    //     status: 'submitted',
    //     dateApplied: Timestamp.fromDate(new Date('2025-01-02')),
    //     roles: ['sourcing'],
    //     reviewer1: 'Dua Lipa',
    //     reviewer2: 'Shawn Mendes',
    //     reviewer1Scores: {
    //       interestInClubScore: 4.2,
    //       interestInSocialGoodScore: 4.1,
    //       npoExpertiseScore: 3.8,
    //       communicationScore: 3.9,
    //     },
    //     reviewer2Scores: {
    //       interestInClubScore: 4.0,
    //       interestInSocialGoodScore: 4.2,
    //       npoExpertiseScore: 4.0,
    //       communicationScore: 4.1,
    //     },
    //   },
    // ];

    const withScores = dummy.map(app => {
      const role = app.roles[0];
      const s1 = calculateScore(role, app.reviewer1Scores);
      const s2 = calculateScore(role, app.reviewer2Scores);
      return {
        ...app,
        reviewerScore1: s1,
        reviewerScore2: s2,
        averageScore: s1 != null && s2 != null ? +(((s1 + s2) / 2).toFixed(2)) : null,
      };
    });

    setApplicants(withScores);
    setFilteredApplicants(withScores);
  }, []);

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
    if (r && roleCounts[r] !== undefined) roleCounts[r]++;
  });
  const totalApplicantsCount = applicants.length;

  const topBoxStyles = [
    {
      category: 'Total Applicants',
      count: totalApplicantsCount,
      roleKey: '',
      defaultStyle: {
        backgroundColor: '#C4A484', 
        color: 'white'
      },
      selectedStyle: {
        backgroundColor: '#8B4513',
        color: 'white'
      }
    },
    {
      category: 'Product Managers',
      count: roleCounts['product manager'] || 0,
      roleKey: 'product manager',
      defaultStyle: { backgroundColor: '#E8F5ED', color: '#056041' },
      selectedStyle: { backgroundColor: '#056041', color: 'white' },
    },
    {
      category: 'Designer',
      count: roleCounts['designer'] || 0,
      roleKey: 'designer',
      defaultStyle: { backgroundColor: '#F9D7E8', color: '#9D174D' },
      selectedStyle: { backgroundColor: '#9D174D', color: 'white' },
    },
    {
      category: 'Tech Lead',
      count: roleCounts['technical lead'] || 0,
      roleKey: 'technical lead',
      defaultStyle: { backgroundColor: '#E9E4F9', color: '#4338CA' },
      selectedStyle: { backgroundColor: '#4338CA', color: 'white' },
    },
    {
      category: 'Engineer',
      count: roleCounts['engineer'] || 0,
      roleKey: 'engineer',
      defaultStyle: { backgroundColor: '#E4F1F7', color: '#0C4A6E' },
      selectedStyle: { backgroundColor: '#0C4A6E', color: 'white' },
    },
    {
      category: 'Sourcing',
      count: roleCounts['sourcing'] || 0,
      roleKey: 'sourcing',
      defaultStyle: { backgroundColor: '#F9F3D7', color: '#854D0E' },
      selectedStyle: { backgroundColor: '#854D0E', color: 'white' },
    },
    {
      category: 'Bootcamp',
      count: roleCounts['bootcamp'] || 0,
      roleKey: 'bootcamp',
      defaultStyle: { backgroundColor: '#FAD7D7', color: '#B91C1C' },
      selectedStyle: { backgroundColor: '#B91C1C', color: 'white' },
    },
  ];

  const getTabButtonStyle = (tabName: string) => {
    const isSelected = currentTab === tabName;
    return {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      backgroundColor: isSelected ? '#2563eb' : 'transparent',
      color: isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    };
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen p-8 font-karla">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex gap-4">
          <button style={getTabButtonStyle('all')} onClick={() => setCurrentTab('all')}>
            Under Review
          </button>
          <button
            style={getTabButtonStyle('qualified')}
            onClick={() => setCurrentTab('qualified')}
          >
            Qualified
          </button>
          <button
            style={getTabButtonStyle('interviewers')}
            onClick={() => setCurrentTab('interviewers')}
          >
            Interviewers
          </button>
          <button
            style={getTabButtonStyle('reviewers')}
            onClick={() => setCurrentTab('reviewers')}
          >
            Reviewers
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#333333]">
          Director of Recruitment Dashboard
        </h1>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-64 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
      </div>

      {(currentTab==="all" || currentTab==="qualified") &&(
      <div className="flex flex-wrap gap-6 mb-6">
        {topBoxStyles.map((box, idx) => {
          const isSelected = selectedRole.toLowerCase() === box.roleKey.toLowerCase();
          const style = isSelected ? box.selectedStyle : box.defaultStyle;
          return (
            <button
              key={idx}
              onClick={() => handleRoleFilter(box.roleKey)}
              style={{
                ...style,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '9.5rem',
                height: '6rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{box.count}</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{box.category}</div>
            </button>
          );
        })}
      </div>)}
      {loading ? <p>Loading applicants...</p> : <DataTable applicants={filteredApplicants} />}
    </div>
  )};

export default ReviewDashboard;
