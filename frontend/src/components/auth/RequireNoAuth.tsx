import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { PermissionRole } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";


interface RequireNoAuthProps {
  children: ReactNode;
  redirect: {
    [key in PermissionRole]: string
  } | string;
}

export default function RequireNoAuth({ children, redirect }: RequireNoAuthProps) {
  const { isLoading, isAuthed, user } = useAuth()

  if (isLoading) return <p>Loading...</p>

  console.log("role: " + user?.role)

  return !isAuthed ? children : <Navigate to={
    (typeof redirect == "string") ?
      redirect :
      redirect[user!.role]
  } replace />
}
