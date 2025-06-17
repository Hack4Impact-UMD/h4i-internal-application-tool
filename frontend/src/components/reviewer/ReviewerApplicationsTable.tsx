import { ReviewerAssignment } from "@/types/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { DataTable } from "../DataTable"

type ReviewerApplicationsTableProps = {
	assignments: ReviewerAssignment[]
}

// export function ApplicantNameCell({ applicantId }: { applicantId: string }) {
// 	const { data: applicant, isLoading, error } = 
// }

export default function ReviewerApplicationsTable({ assignments }: ReviewerApplicationsTableProps) {
	const columnHelper = createColumnHelper<ReviewerAssignment>()
	const cols = useMemo(() => [
		columnHelper.accessor('applicantId', {
			id: 'applicant-name',
			header: 'Applicant ID',
		})
	] as ColumnDef<ReviewerAssignment>[], [])

	return <div>
		<DataTable columns={cols} data={assignments} options={{}}></DataTable>
	</div>
}
