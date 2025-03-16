import { ReactNode, useEffect, useState } from "react";
import { getUserById, loginUser, logoutUser, onAuthStateChange, User } from "../../services/userService";
import { auth } from "../../config/firebase";
import { AuthContext } from "../../contexts/authContext";

interface AuthProviderProps {
  children?: ReactNode
}


interface AuthState {
  user?: User,
  token?: string,
  isAuthed: boolean,
  isLoading: boolean
}

export default function AuthProvider(props: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    token: undefined,
    isAuthed: false,
    isLoading: true
  })

  useEffect(() => {
    return onAuthStateChange(async (userInfo) => {
      console.log(`Auth state changed: ${userInfo?.email}`)
      if (userInfo != null) {
        setAuthState({
          isAuthed: true,
          token: await auth.currentUser?.getIdToken(),
          user: await getUserById(userInfo.uid),
          isLoading: false
        })
      } else {
        setAuthState({
          isAuthed: false,
          token: undefined,
          user: undefined,
          isLoading: false
        })
      }
    })
  }, [])

  return <AuthContext.Provider value={{
    isLoading: authState.isLoading,
    isAuthed: authState.isAuthed,
    user: authState.user,
    token: authState.token,
    login: loginUser,
    logout: logoutUser,
    setUser: (newUser) => {
      setAuthState({
        ...authState,
        user: newUser
      })
    }
  }}>
    {props.children}
  </AuthContext.Provider>
}

