import DashboardShellLink from "@/components/reviewer/DashboardShellLink";
import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/useSearch";
import { Outlet, useParams } from "react-router-dom";

export default function BoardDashboardShell() {
  const { search, setSearch } = useSearch();
  const { formId } = useParams<{ formId: string }>();

  return (
    <div className="w-full grow bg-lightgray flex flex-col items-center p-2 py-4">
      <div className="max-w-5xl w-full rounded bg-white p-4 flex flex-col gap-2">
        <div className="flex gap-2 flex-row items-center">
          <DashboardShellLink
            to={`/admin/board/dashboard/${formId}/interviews`}
            name={"Interviews"}
          />
          <DashboardShellLink
            to={`/admin/board/dashboard/${formId}/assigned-review`}
            name={"Assigned Reviews"}
          />
          <DashboardShellLink
            to={`/admin/board/dashboard/${formId}/assigned-interview`}
            name={"Assigned Interviews"}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-full px-2 py-1 text-sm w-full max-w-md ml-auto"
            placeholder="Search"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
