import { useContext } from "react";
import { AuthContext, AuthProviderContext } from "../contexts/authContext";

export function useAuth(): AuthProviderContext {
  return useContext(AuthContext);
}
