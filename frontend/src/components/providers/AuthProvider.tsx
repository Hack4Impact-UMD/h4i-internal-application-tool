import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getUserById, loginUser, logoutUser, onAuthStateChange, User } from "../../services/userService";
import { auth } from "../../config/firebase";

interface AuthProviderProps {
  children?: ReactNode
}

type AuthProviderContext = {
  user?: User;
  token?: string;
  isAuthed: boolean;
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (newUserData: User) => void

}

const AuthContext = createContext<AuthProviderContext>({
  isAuthed: false,
  isLoading: true,
  login: loginUser,
  logout: logoutUser,
  setUser: () => { }
})

export function useAuth(): AuthProviderContext {
  return useContext(AuthContext);
}

export default function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const [isAuthed, setIsAuthed] = useState<boolean>(false)
  const [token, setToken] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    return onAuthStateChange(async (userInfo) => {
      console.log(`Auth state changed: ${userInfo?.email}`)
      if (userInfo != null) {
        setIsAuthed(true)
        setToken(await auth.currentUser?.getIdToken())
        setUser(await getUserById(userInfo.uid))
      } else {
        setIsAuthed(false)
        setToken(undefined)
        setUser(undefined)
      }
      setIsLoading(false)
    })
  }, [])

  return <AuthContext.Provider value={{ isLoading: isLoading, isAuthed: isAuthed, user: user, token: token, login: loginUser, logout: logoutUser, setUser: setUser }}>
    {props.children}
  </AuthContext.Provider>
}

