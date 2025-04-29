import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import StatusPage from "./components/status/StatusPage";
import DecisionPage from "./components/status/DecisionPage";
import ReviewDashboard from "./pages/ReviewDashboard";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import ResetPassCard from "./pages/ResetPass/ResetPassCard";
import AuthProvider from "./components/providers/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./pages/Layout";
import RequireNoAuth from "./components/auth/RequireNoAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  PermissionRole,
} from "./types/types";
import ApplicationPage from "./pages/ApplicationPage";
import Overview from "./pages/Overview/Overview";
import FormProvider from "./components/providers/FormProvider";
import AppSubmitted from "./pages/AppSubmitted/AppSubmitted";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" />} />

            <Route path="/apply">
              <Route
                index
                element={
                  <RequireAuth>
                    <div>
                      <Overview />
                    </div>
                  </RequireAuth>
                }
              ></Route>
              <Route element={
                <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                  <FormProvider />
                </RequireAuth>
              }>
                <Route
                  path="/apply/f/:formId/:sectionId"
                  element={
                    <ApplicationPage />
                  }
                />
              </Route>
              <Route
                path="/apply/status"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <StatusPage />
                  </RequireAuth>
                }
              />
              <Route path="/apply/success"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <AppSubmitted />
                  </RequireAuth>
                }
              />
              <Route
                path="/apply/decision"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <DecisionPage />
                  </RequireAuth>
                }
              ></Route>
            </Route>

            <Route path="/admin">
              <Route
                index
                element={
                  <RequireAuth
                    requireRoles={[
                      PermissionRole.Reviewer,
                      PermissionRole.SuperReviewer,
                    ]}
                  >
                    <ReviewDashboard></ReviewDashboard>
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
          <Route
            path="/signup"
            element={
              <RequireNoAuth
                redirect={{
                  applicant: "/apply",
                  reviewer: "/admin",
                  "super-reviewer": "/admin",
                }}
              >
                <SignUp />
              </RequireNoAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RequireNoAuth
                redirect={{
                  applicant: "/apply",
                  reviewer: "/admin",
                  "super-reviewer": "/admin",
                }}
              >
                <LogIn />
              </RequireNoAuth>
            }
          />
          <Route path="/forgotpassword" element={<ForgotPass />}></Route>
          <Route path="/resetpassword" element={<ResetPassCard />}></Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
