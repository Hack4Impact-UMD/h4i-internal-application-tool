import { ReactNode } from "react";
import { UserRole } from "../../services/userService";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface RequireAuthProps {
  requireRoles?: UserRole[]
  children: ReactNode
}

export default function RequireAuth({ requireRoles, children }: RequireAuthProps) {
  const { isLoading, isAuthed, user } = useAuth()
  const location = useLocation()

  // check if auth state has been loaded
  if (isLoading) return <p>Loading...</p>

  if (isAuthed) { // user is logged in, check if there are role restrictions
    if (requireRoles) {
      // enforce role restrictions
      if (requireRoles.includes(user!.role)) {
        return children;
      } else {
        return <Navigate to={"/login"} replace state={{ path: location.pathname }} />
      }
    } else { // no role restrictions, show children
      return children
    }
  } else {
    // not logged in, redirect to login page
    return <Navigate to={"/login"} replace state={{ path: location.pathname }} />
  }
}
