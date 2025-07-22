import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ReviewersTable from "../components/dor/ReviewersDashboard/ReviewersTable";
import useSearch from "@/hooks/useSearch";
import { useAllReviewers } from "@/hooks/useReviewers";

export default function SuperReviewerReviewersDashboard() {
  const { formId } = useParams<{ formId: string }>();

  const {
    data: reviewers,
    isPending,
    error,
  } = useAllReviewers();
  const { search } = useSearch();

  if (!formId) return <p>No formId found! The url is probably malformed.</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;
  if (isPending || !reviewers) return <Loading />;

  return (
    <div>
      <ReviewersTable
        reviewers={reviewers}
        formId={formId}
        search={search}
      />
    </div>
  );
}
