import { useApplicants } from "../../hooks/useApplicants";

export default function AdminPlaceholderPage() {
  const { data: applicants, isLoading, error } = useApplicants()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <div className="p-4">
    <h1>All Applicants: </h1>
    <ul>
      {applicants?.map(applicant => <li key={applicant.id}>{applicant.firstName} (ID: {applicant.id})</li>)}
    </ul>
  </div>
}
