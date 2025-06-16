import Loading from "@/components/Loading"
import { useAllApplicationForms } from "@/hooks/useApplicationForm"
import { useAuth } from "@/hooks/useAuth"
import { PermissionRole } from "@/types/types"
import { Link } from "react-router-dom"

export default function AdminHome() {
	const { data: forms, isLoading, error } = useAllApplicationForms()
	const { user } = useAuth()

	if (!user) return <Loading />

	const route = user.role == PermissionRole.Reviewer ? "reviewer" : "dor"

	if (isLoading) return <Loading />
	if (error) return <p>Failed to fetch forms: {error.message}</p>
	if (!forms) return <p>Failed to fetch forms!</p>

	return <div className="w-full h-full px-2 py-4 flex flex-col bg-lightgray items-center">
		<div className="max-w-5xl w-full p-4 bg-white">
			<h1 className="text-xl font-bold mt-4">Select a form</h1>
			<p className="text-muted-foreground">To access dashboards, you need to select which form you want to view application and review data for.</p>

			<ul className="flex flex-col gap-2 mt-4">
				{forms.map(form => {
					return <Link className="border border-gray-300 p-2 rounded-md flex flex-row gap-2 items-center" to={`/admin/${route}/dashboard/${form.id}`} key={form.id}>
						<span className={`${!form.isActive ? 'bg-muted' : 'bg-lightblue'} px-2 py-1 text-sm rounded-full`}>{form.isActive ? "Active" : "Inactive"}</span>
						<span>Semester: {form.semester} (ID: {form.id})</span>
					</Link>
				})}
			</ul>
		</div>
	</div>
}
