import useSearch from "@/hooks/useSearch";
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function SuperReviewerDashboardShell() {
  const { search, setSearch } = useSearch();
  const { formId } = useParams<{ formId: string }>();

  return (
    <div className="w-full h-full bg-lightgray flex flex-col items-center p-2 py-4">
      <div className="max-w-5xl w-full rounded bg-white p-4 flex flex-col gap-2">
        <div className="flex gap-2 flex-row items-center">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 bg-blue text-white rounded text-sm"
                : "p-2 text-fg rounded text-sm transition hover:bg-blue/90 hover:text-white"
            }
            to={`/admin/dor/dashboard/${formId}/all`}
          >
            All Applications
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 bg-blue text-white rounded text-sm"
                : "p-2 text-fg rounded text-sm transition hover:bg-blue/90 hover:text-white"
            }
            to={`/admin/dor/dashboard/${formId}/qualified`}
          >
            Qualified
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 bg-blue text-white rounded text-sm"
                : "p-2 text-fg rounded text-sm transition hover:bg-blue/90 hover:text-white"
            }
            to={`/admin/dor/dashboard/${formId}/reviewers`}
          >
            Reviewers
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 bg-blue text-white rounded text-sm"
                : "p-2 text-fg rounded text-sm transition hover:bg-blue/90 hover:text-white"
            }
            to={`/admin/dor/dashboard/${formId}/interviewers`}
          >
            Interviewers
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
