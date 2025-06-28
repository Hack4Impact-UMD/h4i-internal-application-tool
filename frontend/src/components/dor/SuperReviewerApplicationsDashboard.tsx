import { useState } from "react";
import { Button } from "../ui/button";
import { ApplicantRole } from "@/types/types";
import { applicantRoleColor, applicantRoleDarkColor, displayApplicantRoleName } from "@/utils/display";

export default function SuperReviewerApplicationsDashboard() {
	const [statusFilter, setStatusFilter] = useState<
		"all" | ApplicantRole
	>("all");

	return <div>
		<div className="overflow-x-scroll flex flex-row gap-2 items-center min-h-28 justify-stretch mt-4">
			<Button
				className={`h-28 min-w-40 text-white p-4 flex flex-col items-start 
					${statusFilter == "all" ? "bg-[#4A280D] hover:bg-[#4A280D]/90 text-[#F1D5C4]" : "bg-[#F1D5C4] hover:bg-[#F1D5C4]/90 text-[#4A280D]"}`}
				onClick={() => setStatusFilter("all")}
			>
				<span className="text-3xl">{50}</span>
				<span className="mt-auto">Total Applications</span>
			</Button>
			{Object.values(ApplicantRole).map(role => {
				const dark = applicantRoleDarkColor(role) ?? "#000000"
				const light = applicantRoleColor(role) ?? "#FFFFFF"
				const active = statusFilter == role

				return <Button
					className={`h-28 min-w-40 p-4 flex flex-col items-start`}
					style={{
						backgroundColor: active ? dark : light,
						color: active ? light : dark
					}}
					onClick={() => setStatusFilter(role)}
				>
					<span className="text-3xl">{10}</span>
					<span className="mt-auto">{displayApplicantRoleName(role)}</span>
				</Button>
			})}
		</div>
	</div>
}
