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
import { ToastContainer } from "react-toastify";
import { queryClient } from "./config/query";
import UserRolePage from "./pages/UserRolePage";
import ReviewerApplicationsDashboard from "./pages/ReviewerApplicationsDashboard";
import AdminHome from "./pages/AdminHome";
import SuperReviewerDashboardShell from "./pages/SuperReviewerDashboardShell";
import SearchProvider from "./components/providers/SearchProvider";
import SuperReviewerApplicationsDashboard from "./components/dor/SuperReviewerApplicationsDashboard";
import { AssignedReviewsPage } from "./pages/AssignedReviewsPage";
import { AssignedApplicationsPage } from "./pages/AssignedApplicationsPage";
import AppRevisitPage from "./pages/AppRevisitPage";
import NotFoundPage from "./pages/NotFoundPage";
import ViewApplicationPage from "./pages/ViewApplicationPage";
import ReviewerDashboardShell from "./pages/ReviewerDashboardShell";
import SuperReviewerReviewersDashboard from "./pages/SuperReviewerReviewersDashboard";

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
                  <div className="w-full h-full bg-muted">
                    <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                      <FormProvider />
                    </RequireAuth>
                  </div>
                }
              >
                <Route
                  path="f/:formId/:sectionId"
                  element={<ApplicationPage />}
                />
              </Route>
              <Route
                path="status"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <StatusPage />
                  </RequireAuth>
                }
              />
              <Route
                path="revisit/:formId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <AppRevisitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="submit/:formId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <AppSubmitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="success"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <AppSubmitted />
                  </RequireAuth>
                }
              />
              <Route
                path="decision"
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
                  <RequireAuth>
                    <AdminHome />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="dor/"
                element={
                  <RequireAuth>
                    <SearchProvider>
                      <SuperReviewerDashboardShell />
                    </SearchProvider>
                  </RequireAuth>
                }
              >
                <Route
                  path="dashboard/:formId/all"
                  element={<SuperReviewerApplicationsDashboard />}
                />
                <Route
                  path="dashboard/:formId/qualified"
                  element={<p>Qualified</p>}
                />
                <Route
                  path="dashboard/:formId/reviewers"
                  element={<SuperReviewerReviewersDashboard />}
                />
              </Route>

              <Route
                path="dor/application/:formId/:responseId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                    <ViewApplicationPage />
                  </RequireAuth>
                }
              />

              <Route
                path="dor/reviews/:responseId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                    <AssignedReviewsPage />
                  </RequireAuth>
                }
              />

              <Route
                path="dor/applications/:formId/:reviewerId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                    <AssignedApplicationsPage />
                  </RequireAuth>
                }
              />

              <Route
                path="dor/users"
                element={
                  <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                    <UserRolePage></UserRolePage>
                  </RequireAuth>
                }
              />

              <Route
                path="dor/response/:responseId"
                element={
                  <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                    <AppRevisitPage />
                  </RequireAuth>
                }
              />

              <Route
                path="reviewer/dashboard/:formId/"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Reviewer]}>
                    <SearchProvider>
                      <ReviewerDashboardShell />
                    </SearchProvider>
                  </RequireAuth>
                }
              >
                <Route
                  path="apps"
                  element={<ReviewerApplicationsDashboard />}
                />

                <Route path="interviews" element={<p>Interviews</p>} />
              </Route>
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
                  path="review/f/:formId/:responseId/:sectionId/:reviewDataId" // TODO: change the routing to refer to an applicant + form, different provider
                  element={<AppReviewPage />}
                />
              </Route>
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

          {/*WARN:MAKE SURE THIS IS THE LAST ROUTE*/}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
