import useSearch from "@/hooks/useSearch";
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function ReviewerDashboardShell() {
  const { search, setSearch } = useSearch();
  const { formId } = useParams<{ formId: string }>();

  return (
    <div className="w-full grow bg-lightgray flex flex-col items-center p-2 py-4">
      <div className="max-w-5xl w-full rounded bg-white p-4 flex flex-col gap-2">
        <div className="flex gap-2 flex-row items-center">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 bg-blue text-white rounded text-sm"
                : "p-2 text-fg rounded text-sm transition hover:bg-blue/80 hover:text-white"
            }
            to={`/admin/reviewer/dashboard/${formId}/apps`}
          >
            Assigned Applications
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 bg-blue text-white rounded text-sm"
                : "p-2 text-fg rounded text-sm transition hover:bg-blue/80 hover:text-white"
            }
            to={`/admin/reviewer/dashboard/${formId}/interviews`}
          >
            Assigned Interviews
          </NavLink>
          <input
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
