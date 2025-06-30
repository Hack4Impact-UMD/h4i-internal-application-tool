import Loading from "@/components/Loading";
import ReviewerApplicationsTable from "@/components/reviewer/ReviewerApplicationsTable";
import { Button } from "@/components/ui/button";
import { useMyReviewAssignments } from "@/hooks/useReviewAssignments";
import { useMyReviews } from "@/hooks/useReviewData";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ReviewerDashboard() {
  const { formId } = useParams();
  const {
    data: assignedApps,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useMyReviewAssignments(formId ?? "");
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewError,
  } = useMyReviews(formId ?? "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "reviewed" | "pending"
  >("all");

  //NOTE: Just for testing, duplicates a bunch of rows
  // const rows = useMemo(() => assignedApps?.flatMap(row => Array.from({ length: 100 }, () => row)) ?? [], [assignedApps])

  const numReviewed = useMemo(
    () =>
      assignedApps?.filter((f) =>
        reviews?.filter(r => r.submitted && r.forRole == f.forRole)
          ?.map((r) => r.applicationResponseId)
          .includes(f.applicationResponseId),
      ).length,
    [reviews, assignedApps],
  );

  if (!formId) return <p>Form ID not provided!</p>;

  if (assignmentsLoading || reviewsLoading || !assignedApps) return <Loading />;
  if (assignmentsError)
    return (
      <p>Failed to fetch assigned applications: {assignmentsError.message}</p>
    );
  if (reviewError)
    return <p>Failed to fetch assigned applications: {reviewError.message}</p>;

  return (
    <div className="w-full h-full bg-lightgray flex flex-col items-center p-2 py-4">
      <div className="max-w-5xl w-full rounded bg-white p-4 flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <Link
            className="p-2 bg-blue text-white rounded text-sm"
            to={`/admin/reviewer/dashboard/${formId}`}
          >
            Under Review
          </Link>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-full px-2 py-1 text-sm min-w-sm ml-auto"
            placeholder="Search"
          />
        </div>
        <div className="flex flex-row gap-2 items-center min-h-28 justify-stretch mt-8">
          <Button
            className={`h-28 min-w-40 text-white p-4 flex flex-col items-start 
					${statusFilter == "all" ? "bg-[#17476B] hover:bg-[#17476B]/90 text-[#D5E7F2]" : "bg-[#D5E7F2] hover:bg-[#D5E7F2]/90 text-[#17476B]"}`}
            onClick={() => setStatusFilter("all")}
          >
            <span className="text-3xl">{assignedApps.length}</span>
            <span className="mt-auto">Total Applications</span>
          </Button>
          <Button
            className={`h-28 min-w-40 p-4 flex flex-col items-start 
					${statusFilter != "reviewed" ? "bg-[#DCEBDD] hover:bg-[#DCEBDD]/90 text-[#1D3829]" : "bg-[#1D3829] hover:bg-[#1D3829]/90 text-[#DCEBDD]"}`}
            onClick={() => setStatusFilter("reviewed")}
          >
            <span className="text-3xl">{numReviewed}</span>
            <span className="mt-auto">Reviewed</span>
          </Button>
          <Button
            className={`h-28 min-w-40 p-4 flex flex-col items-start 
					${statusFilter != "pending" ? "bg-[#FBDED9] hover:bg-[#FBDED9]/90 text-[#5D1615]" : "bg-[#5D1615] hover:bg-[#5D1615]/90 text-[#FBDED9]"}`}
            onClick={() => setStatusFilter("pending")}
          >
            <span className="text-3xl">
              {assignedApps.length - (numReviewed ?? 0)}
            </span>
            <span className="mt-auto">Pending</span>
          </Button>
        </div>
        <ReviewerApplicationsTable
          formId={formId}
          statusFilter={statusFilter}
          search={search}
          assignments={assignedApps}
        />
      </div>
    </div>
  );
}
