import { ReactNode } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

interface RequireNoAuthProps {
  children: ReactNode;
  redirect: string;
}

export default function RequireNoAuth({ children, redirect }: RequireNoAuthProps) {
  const { isLoading, isAuthed } = useAuth()

  if (isLoading) return <p>Loading...</p>

  return !isAuthed ? children : <Navigate to={redirect} replace />
}
