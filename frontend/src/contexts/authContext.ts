import { createContext } from "react";
import { loginUser, logoutUser, UserProfile } from "../services/userService";

export type AuthProviderContext = {
  user?: UserProfile;
  token?: string;
  isAuthed: boolean;
  isLoading: boolean
  login: (username: string, password: string) => Promise<UserProfile>
  logout: () => Promise<void>
  setUser: (newUserData: UserProfile) => void
}

export const AuthContext = createContext<AuthProviderContext>({
  isAuthed: false,
  isLoading: true,
  login: loginUser,
  logout: logoutUser,
  setUser: () => { }
})
