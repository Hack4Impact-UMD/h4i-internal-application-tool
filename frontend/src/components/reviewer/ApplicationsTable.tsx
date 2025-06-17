import { ReviewerAssignment } from "@/types/types"

type ReviewerApplicationsTableProps = {
	assignments: ReviewerAssignment[]
}

export default function ReviewerApplicationsTable({ assignments }: ReviewerApplicationsTableProps) {
	return <p>Applications table goes here</p>
}
