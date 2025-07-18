import { createContext } from "react";
import { loginUser, logoutUser } from "../services/userService";
import { UserProfile } from "../types/types";

export type AuthProviderContext = {
  user?: UserProfile;
  token?: string;
  isAuthed: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  setUser: (newUserData: UserProfile) => void;
};

export const AuthContext = createContext<AuthProviderContext>({
  isAuthed: false,
  isLoading: true,
  login: loginUser,
  logout: logoutUser,
  setUser: () => {},
});
