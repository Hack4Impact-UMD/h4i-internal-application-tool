import { useEffect, useState } from 'react';
import ProgressBar from '../components/reviewer/ProgressBar';
import FilterBar from '../components/reviewer/FilterBar';
import DataTable from '../components/reviewer/DataTable';
import './ReviewDashboard.css';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../backend/config/firebase';


export type Applicant = {
  id: string;
  name: string;
  email: string;
  status: string;
  dateApplied: Timestamp;
  roles: string[];
  applicationScore: string | null;
  interviewScore: string | null;
  overallScore: string | null;
};


function ReviewDashboard() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        console.log(db)
        const applicantsCollection = collection(db, 'users');
        const applicantsSnapshot = await getDocs(applicantsCollection);
        console.log('Fetching documents from the "users" collection...');
        applicantsSnapshot.docs.forEach((doc) => {
          console.log('Document ID:', doc.id);
        });
        const applicantsList: Applicant[] = applicantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Applicant[];
        console.log(applicantsList);
        setApplicants(applicantsList);
        setAllApplicants(applicantsList);
        setFilteredApplicants(applicantsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setLoading(false);
      }
    };

    fetchApplicants();
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

  const handleSortByDate = () => {
    const sortedApplicants = [...filteredApplicants].sort((a, b) => {
      const dateA = a.dateApplied && a.dateApplied.toDate ? a.dateApplied.toDate() : new Date(0); // Default to an old date if no date exists
      const dateB = b.dateApplied && b.dateApplied.toDate ? b.dateApplied.toDate() : new Date(0); // Same as above

      return dateA - dateB;
    });
    setFilteredApplicants(sortedApplicants);
  };


  return (
    <div className="App">
      <>
        <img src="Header.jpg" alt="Header" className="navbar-header-image" />
        <header>
          <div className="banner"></div>
          <h1>Applicant Review Portal</h1>
        </header>
        <div className="styled-box">
          <div className="box-header">
            <h2 className="box-title">Number of Applicants:</h2>
            <h2 className="box-title">Applicants Finalized</h2>
          </div>
          <ProgressBar finalized={finalizedApplicants.length} total={allApplicants.length} />
          <div className="numbers">
            <span className="applicants-count">{allApplicants.length}</span>
            <span className="finalized-count">{finalizedApplicants.length}</span>
          </div>
        </div>
        <main className="container mx-auto p-4">
          <FilterBar
            onSearch={handleSearch}
            onSortByDate={handleSortByDate}
            onRoleFilter={handleRoleFilter}
            selectedRole={selectedRole}
          />
          {loading ? (
            <p>Loading applicants...</p>
          ) : (
            <DataTable applicants={filteredApplicants} />
          )}
        </main>
      </>
    </div>
  );
}

export default ReviewDashboard;
