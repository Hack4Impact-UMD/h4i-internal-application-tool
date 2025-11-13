import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface DashboardShellLinkProps {
  to: string;
  name: string;
}

export default function DashboardShellLink({ to, name }: DashboardShellLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge("p-2 rounded text-sm whitespace-nowrap transition hover:bg-blue/80 hover:text-white", isActive 
          ? "bg-blue text-white" 
          : "text-fg"
        )
      }
    >
      {name}
    </NavLink>
  );
}
