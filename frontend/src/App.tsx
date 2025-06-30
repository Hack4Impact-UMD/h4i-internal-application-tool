import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import StatusPage from "./components/status/StatusPage";
import DecisionPage from "./components/status/DecisionPage";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import ResetPassCard from "./pages/ResetPass/ResetPassCard";
import AuthProvider from "./components/providers/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./pages/Layout";
import RequireNoAuth from "./components/auth/RequireNoAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { PermissionRole } from "./types/types";
import ApplicationPage from "./pages/ApplicationPage";
import Overview from "./pages/Overview/Overview";
import FormProvider from "./components/providers/FormProvider";
import AppSubmitted from "./pages/AppSubmitted/AppSubmitted";
import AppSubmitPage from "./pages/AppSubmitPage";
import AppReviewPage from "./pages/AppReviewPage";
import ReviewProvider from "./components/providers/ReviewProvider";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./config/query";
import UserRolePage from "./pages/UserRolePage";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import AdminHome from "./pages/AdminHome";
import SuperReviewerDashboardShell from "./pages/SuperReviewerDashboardShell";
import SearchProvider from "./components/providers/SearchProvider";
import SuperReviewerApplicationsDashboard from "./components/dor/SuperReviewerApplicationsDashboard";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer
          // for error notifications; separate from Layout as it is needed in the account management pages
          position="bottom-right"
          toastClassName={() => "bg-transparent shadow-none border-none mb-3"}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" />} />

            <Route path="/apply">
              <Route
                index
                element={
                  <RequireAuth>
                    <Overview />
                  </RequireAuth>
                }
              ></Route>
              <Route
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <FormProvider />
                  </RequireAuth>
                }
              >
                <Route
                  path="/apply/f/:formId/:sectionId"
                  element={<ApplicationPage />}
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
              <Route
                path="/apply/submit/:formId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <AppSubmitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/apply/success"
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

            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminHome />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/dor/"
              element={
                <RequireAuth>
                  <SearchProvider>
                    <SuperReviewerDashboardShell />
                  </SearchProvider>
                </RequireAuth>
              }
            >
              <Route
                path="/admin/dor/dashboard/:formId/all"
                element={<SuperReviewerApplicationsDashboard />}
              />
              <Route
                path="/admin/dor/dashboard/:formId/qualified"
                element={<p>Qualified</p>}
              />
              <Route
                path="/admin/dor/dashboard/:formId/reviewers"
                element={<p>Reviewers</p>}
              />
            </Route>

            <Route
              path="/admin/reviewer/dashboard/:formId"
              element={
                <RequireAuth requireRoles={[PermissionRole.Reviewer]}>
                  <ReviewerDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/dor/users"
              element={
                <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                  <UserRolePage></UserRolePage>
                </RequireAuth>
              }
            />
            <Route
              element={
                <RequireAuth
                  requireRoles={[
                    PermissionRole.Reviewer,
                    PermissionRole.SuperReviewer,
                  ]}
                >
                  <Outlet />
                </RequireAuth>
              }
            >
              <Route
                path="/admin/review/f/:formId/:responseId/:sectionId/:reviewDataId" // TODO: change the routing to refer to an applicant + form, different provider
                element={<AppReviewPage />}
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
