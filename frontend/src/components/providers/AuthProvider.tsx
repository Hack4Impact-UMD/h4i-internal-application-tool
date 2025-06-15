import { ReactNode, useEffect, useState } from "react";
import { getUserById, loginUser, logoutUser, onAuthStateChange, setReviewerRolePreferences } from "../../services/userService";
import { ApplicantRole, PermissionRole, UserProfile } from "../../types/types";
import { auth } from "../../config/firebase";
import { AuthContext } from "../../contexts/authContext";
import ReviewerRoleSelectDialog from "../reviewer/ReviewerRoleSelectDialog";
import { useMutation } from "@tanstack/react-query";
import { throwErrorToast } from "../error/ErrorToast";
import { throwSuccessToast } from "../toasts/SuccessToast";

interface AuthProviderProps {
  children?: ReactNode
}


interface AuthState {
  user?: UserProfile,
  token?: string,
  isAuthed: boolean,
  isLoading: boolean
}


export default function AuthProvider(props: AuthProviderProps) {
  const MIN_REVIEWER_ROLE_PREFS = 3

  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    token: undefined,
    isAuthed: false,
    isLoading: true
  })

  const submitMutation = useMutation({
    mutationFn: (roles: ApplicantRole[]) => setReviewerRolePreferences(authState.user?.id ?? "", roles),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data, vars, _ctx) => {
      if (authState.user?.role == PermissionRole.Reviewer) {
        setAuthState({
          ...authState,
          user: {
            ...authState.user!,
            applicantRolePreferences: vars
          }
        })
        throwSuccessToast("Successfully updated role preferences!")
      }
    },
    onError: () => {
      throwErrorToast("Failed to set review preferences!")
    }
  })

  useEffect(() => {
    return onAuthStateChange(async (userInfo) => {
      console.log(`Auth state changed: ${userInfo?.email}`)
      if (userInfo != null) {
        const user = await getUserById(userInfo.uid)
        const token = await auth.currentUser?.getIdToken()
        setAuthState({
          isAuthed: true,
          token: token,
          user: user,
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
    {
      authState.user?.role == PermissionRole.Reviewer &&
      <ReviewerRoleSelectDialog
        open={!authState.user.applicantRolePreferences || authState.user.applicantRolePreferences.length < MIN_REVIEWER_ROLE_PREFS}
        minRoles={MIN_REVIEWER_ROLE_PREFS}
        onSubmit={(roles) => submitMutation.mutate(roles)} />
    }
    {props.children}
  </AuthContext.Provider>
}

