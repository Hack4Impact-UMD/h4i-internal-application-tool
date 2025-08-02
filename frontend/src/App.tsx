import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import AuthProvider from "./components/providers/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import RequireNoAuth from "./components/auth/RequireNoAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { PermissionRole } from "./types/types";
import FormProvider from "./components/providers/FormProvider";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./config/query";
import SearchProvider from "./components/providers/SearchProvider";
import Loading from "./components/Loading";

const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"))
const StatusPage = lazy(() => import("./components/status/StatusPage"));
const DecisionPage = lazy(() => import("./components/status/DecisionPage"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const LogIn = lazy(() => import("./pages/LogIn/LogIn"));
const ForgotPass = lazy(() => import("./pages/ForgotPass/ForgotPass"));
const ResetPassCard = lazy(() => import("./pages/ResetPass/ResetPassCard"));
const Layout = lazy(() => import("./pages/Layout"));
const ApplicationPage = lazy(() => import("./pages/ApplicationPage"));
const Overview = lazy(() => import("./pages/Overview/Overview"));
const AppSubmitted = lazy(() => import("./pages/AppSubmitted/AppSubmitted"));
const AppSubmitPage = lazy(() => import("./pages/AppSubmitPage"));
const AppReviewPage = lazy(() => import("./pages/AppReviewPage"));
const UserRolePage = lazy(() => import("./pages/UserRolePage"));
const ReviewerApplicationsDashboard = lazy(
  () => import("./pages/ReviewerApplicationsDashboard"),
);
const AdminHome = lazy(() => import("./pages/AdminHome"));
const SuperReviewerDashboardShell = lazy(
  () => import("./pages/SuperReviewerDashboardShell"),
);
const SuperReviewerApplicationsDashboard = lazy(
  () => import("./components/dor/SuperReviewerApplicationsDashboard"),
);
const AssignedReviewsPage = lazy(() =>
  import("./pages/AssignedReviewsPage").then(module => ({
    default: module.AssignedReviewsPage,
  })),
);
const AssignedApplicationsPage = lazy(() =>
  import("./pages/AssignedApplicationsPage").then(module => ({
    default: module.AssignedApplicationsPage,
  })),
);
const AppRevisitPage = lazy(() => import("./pages/AppRevisitPage"));
const QualifiedApplicationsDashboard = lazy(
  () => import("./pages/QualifiedApplicationsDashboard"),
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ViewApplicationPage = lazy(() => import("./pages/ViewApplicationPage"));
const ReviewerDashboardShell = lazy(
  () => import("./pages/ReviewerDashboardShell"),
);
const SuperReviewerReviewersDashboard = lazy(
  () => import("./pages/SuperReviewerReviewersDashboard"),
);
const ReviewerInterviewsDashboard = lazy(
  () => import("./pages/ReviewerInterviewsDashboard"),
);
const FormValidationPage = lazy(() =>
  import("./pages/FormValidationPage").then(module => ({
    default: module.FormValidationPage,
  })),
);
const SuperReviewerInterviewersDashboard = lazy(
  () => import("./pages/SuperReviewerInterviewersDashboard"),
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer
          // for error notifications; separate from Layout as it is needed in the account management pages
          position="bottom-right"
          toastClassName={() => "bg-transparent shadow-none border-none mb-3"}
        />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/login" />} />

              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />

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
                    element={<QualifiedApplicationsDashboard />}
                  />
                  <Route
                    path="dashboard/:formId/reviewers"
                    element={<SuperReviewerReviewersDashboard />}
                  />
                  <Route
                    path="dashboard/:formId/interviewers"
                    element={<SuperReviewerInterviewersDashboard />}
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
                  path="dor/forms"
                  element={
                    <RequireAuth requireRoles={[PermissionRole.SuperReviewer]}>
                      <FormValidationPage />
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

                  <Route
                    path="interviews"
                    element={<ReviewerInterviewsDashboard />}
                  />
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
            <Route path="/verify" element={<VerifyEmailPage />}></Route>

            {/*WARN:MAKE SURE THIS IS THE LAST ROUTE*/}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
