import { useState } from "react";
import Navbar from "../components/reviewer/ProgressBar";
import ProgressBar from "../components/reviewer/ProgressBar";
import FilterBar from "../components/reviewer/FilterBar";
import DataTable from "../components/reviewer/DataTable";
import { Applicant } from "./ReviewDashboard";
import { getAllApplicants } from '../services/applicantService';


  const mockApplicants: Applicant[] = (await getAllApplicants()) as unknown as Applicant[];

//  [
//   {
//     id: "1",
//     name: 'Nya Kassa',
//     email: 'akassa@gmail.com',
//     status: 'App. Completed',
//     dateApplied: '2024-11-08',
//     roles: ['TL', 'Er'],
//     applicationScore: null,
//     interviewScore: null,
//     overallScore: null,
//   },
//   {
//     id: "2",
//     name: 'Kenya Parr',
//     email: 'k.parr@terpmail.umd.com',
//     status: 'Interview Offered',
//     dateApplied: '2024-11-03',
//     roles: ['Sg', 'Ds', 'PM'],
//     applicationScore: '12/12',
//     interviewScore: null,
//     overallScore: null,
//   },
//   {
//     id: "3",
//     name: 'Kayla Singh',
//     email: 'k.singh@terpmail.umd.com',
//     status: 'Interview Conducted',
//     dateApplied: '2024-11-05',
//     roles: ['TL', 'Er'],
//     applicationScore: '11/12',
//     interviewScore: null,
//     overallScore: null,
//   },
// ];
const ApplicantReview = () => {
  // const [search, setSearch] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState(mockApplicants);

  const handleSearch = (query: string) => {
    // setSearch(query);
    setFilteredApplicants(
      mockApplicants.filter((applicant: Applicant) =>
        applicant.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div>
      <Navbar finalized={0} total={0} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Applicant Review Portal</h1>
        <ProgressBar finalized={195} total={200} />
        <FilterBar onSearch={handleSearch} selectedRole="" />
        <DataTable applicants={filteredApplicants} />
      </div>
    </div>
  );
};

export default ApplicantReview;
