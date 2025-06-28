import { createContext } from "react";
import { Outlet } from "react-router-dom";

export default function SuperReviewerDashboardShell() {
  return (
    <div>
      <p>DOR Shell!</p>
      <Outlet />
    </div>
  );
}
