import Loading from "@/components/Loading";
import ReviewerApplicationsTable from "@/components/reviewer/ReviewerApplicationsTable";
import { Button } from "@/components/ui/button";
import { useMyReviewAssignments } from "@/hooks/useReviewAssignments";
import { Link, useParams } from "react-router-dom";

export default function ReviewerDashboard() {
	const { formId } = useParams()
	const { data: assignedApps, isLoading, error } = useMyReviewAssignments(formId ?? "")

	if (!formId) return <p>Form ID not provided!</p>

	if (isLoading) return <Loading />
	if (error) return <p>Failed to fetch assigned applications: {error.message}</p>

	return <div className="w-full h-full bg-lightgray flex flex-col items-center p-2 py-4">
		<div className="max-w-5xl w-full rounded bg-white p-4 flex flex-col gap-2">
			<div className="flex flex-row items-center">
				<Link className="p-2 bg-blue text-white rounded text-sm" to={`/admin/reviewer/dashboard/${formId}`}>Under Review</Link>
				<input className="border border-gray-300 rounded-full px-2 py-1 text-sm min-w-sm ml-auto" placeholder="Search" />
			</div>
			<div className="flex flex-row gap-2 items-center min-h-28 justify-stretch mt-8">
				<Button className="h-28 min-w-40 text-white p-4 flex flex-col items-start bg-[#17476B] hover:bg-[#17476B]/90">
					<span className="text-3xl">
						70
					</span>
					<span className="mt-auto">Total Applications</span>
				</Button>
				<Button className="h-28 min-w-40 p-4 flex flex-col items-start bg-[#DCEBDD] hover:bg-[#DCEBDD]/90 text-[#1D3829]">
					<span className="text-3xl">
						55
					</span>
					<span className="mt-auto">Reviewed</span>
				</Button>
				<Button className="h-28 min-w-40 p-4 flex flex-col items-start bg-[#FBDED9] hover:bg-[#FBDED9]/90 text-[#5D1615]">
					<span className="text-3xl">
						15
					</span>
					<span className="mt-auto">Pending</span>
				</Button>
			</div>
			<ReviewerApplicationsTable search={""} assignments={assignedApps?.flatMap(row => Array.from({ length: 100 }, () => row)) ?? []} />
		</div>
	</div>
}
