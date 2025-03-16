import { createContext } from "react";
import { loginUser, logoutUser, User } from "../services/userService";

export type AuthProviderContext = {
  user?: User;
  token?: string;
  isAuthed: boolean;
  isLoading: boolean
  login: (username: string, password: string) => Promise<User>
  logout: () => Promise<void>
  setUser: (newUserData: User) => void
}

export const AuthContext = createContext<AuthProviderContext>({
  isAuthed: false,
  isLoading: true,
  login: loginUser,
  logout: logoutUser,
  setUser: () => { }
})
