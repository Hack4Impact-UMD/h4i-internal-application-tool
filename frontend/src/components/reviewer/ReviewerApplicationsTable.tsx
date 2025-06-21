import { ApplicantRole, ApplicationReviewData, AppReviewAssignment } from "@/types/types"
import { ColumnDef, createColumnHelper, getPaginationRowModel } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { DataTable } from "../DataTable"
import { Button } from "../ui/button"
import { useQuery } from "@tanstack/react-query"
import { getApplicantById } from "@/services/applicantService"
import { getReviewDataForAssignemnt } from "@/services/reviewDataService"
import { applicantRoleColor, displayApplicantRoleName } from "@/utils/display"

type ReviewerApplicationsTableProps = {
	assignments: AppReviewAssignment[],
	search: string,
	rowCount?: number,
	statusFilter: 'all' | 'reviewed' | 'pending'
}

type AssignmentRow = {
	index: number,
	applicant: string,
	role: ApplicantRole,
	review?: ApplicationReviewData,
	score: {
		value?: number,
		outOf?: number
	}
}

export default function ReviewerApplicationsTable({ assignments, search, rowCount = 20, statusFilter = 'all' }: ReviewerApplicationsTableProps) {
	function useRows(pageIndex: number) {
		return useQuery({
			queryKey: ["my-assignment-rows", pageIndex],
			placeholderData: (prev) => prev,
			queryFn: async () => {
				return Promise.all(assignments
					.slice(pageIndex * rowCount, Math.min(assignments.length, (pageIndex + 1) * rowCount))
					.map(async (assignment, index) => {
						const user = await getApplicantById(assignment.applicantId)
						const review = await getReviewDataForAssignemnt(assignment)

						const avgScore = (scores: { [score in string]: number }) => {
							const keys = Object.keys(scores)
							const sum = keys.reduce((acc, key) => scores[key] + acc, 0)
							return sum / keys.length
						}

						const row: AssignmentRow = {
							index: 1 + pageIndex * rowCount + index,
							applicant: `${user.firstName} ${user.lastName}`,
							role: assignment.forRole,
							review: review,
							score: {
								value: review ? avgScore(review.applicantScores) : undefined,
								outOf: 4 // NOTE: All scores are assummed to be out of 4
							}
						}

						return row
					}))
			}
		})
	}

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	})

	const columnHelper = createColumnHelper<AssignmentRow>()
	const cols = useMemo(() => [
		columnHelper.accessor('index', {
			id: 'number',
			header: 'S. NO',
			cell: ({ getValue }) => getValue()
		}),
		columnHelper.accessor('applicant', {
			id: 'applicant-name',
			header: 'APPLICANT',
		}),
		columnHelper.accessor('role', {
			id: 'role',
			header: 'ROLE',
			cell: ({ getValue }) => <span style={{ backgroundColor: applicantRoleColor(getValue()) }} className={`rounded-full px-2 py-1`}>{displayApplicantRoleName(getValue())}</span>
		}),
		columnHelper.accessor('score', {
			id: 'score',
			header: 'SCORE',
			cell: ({ getValue }) => getValue().value && getValue().outOf ? `${getValue().value}/${getValue().outOf}` : `N/A`
		}),
		columnHelper.accessor('review', {
			id: 'review-status',
			header: 'ACTION',
			cell: ({ getValue }) => {
				const review = getValue()
				if (review) {
					return <Button variant="outline" className="border-2 rounded-full">Edit</Button>
				} else {
					return <Button variant="outline" className="border-2 rounded-full">Review</Button>
				}
			},
			filterFn: (row, columnId, filterValue) => {
				const value = row.getValue(columnId) as ApplicationReviewData | undefined

				if (filterValue == 'all') return true
				else if (filterValue == 'pending') return !value
				else if (filterValue == 'reviewed') return !!value
				else return true
			}
		})
	] as ColumnDef<AssignmentRow>[], [columnHelper])


	const { data: rows, isPending, error } = useRows(pagination.pageIndex)

	if (isPending || !rows) return <p>Loading...</p>
	if (error) return <p>Something went wrong: {error.message}</p>

	return <div className="flex flex-col w-full gap-2">
		<DataTable
			columns={cols}
			data={rows}
			className="border-none rounded-none"
			options={{
				getPaginationRowModel: getPaginationRowModel(),
				manualPagination: true,
				onPaginationChange: setPagination,
				rowCount: rowCount,
				enableGlobalFilter: true,
				state: {
					globalFilter: search,
					pagination,
					columnFilters: [
						{
							id: 'review-status',
							value: statusFilter
						}
					]
				}
			}}
		/>
		<div className="flex flex-row gap-2">
			<span>Page {pagination.pageIndex + 1} of {Math.ceil(assignments.length / rowCount)}</span>
			<div className="ml-auto">
				<Button variant="outline" disabled={pagination.pageIndex <= 0} onClick={() => setPagination({
					...pagination,
					pageIndex: pagination.pageIndex - 1
				})}>Previous Page</Button>
				<Button variant="outline" disabled={(pagination.pageIndex + 1) * rowCount >= assignments.length - 1} onClick={() => setPagination({
					...pagination,
					pageIndex: pagination.pageIndex + 1
				})}>Next Page</Button>
			</div>
		</div>
	</div>
}
