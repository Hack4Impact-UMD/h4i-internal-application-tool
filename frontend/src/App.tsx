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
import LandingPage from "./pages/LandingPage";

const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const StatusPage = lazy(() => import("./components/status/StatusPage"));
const DecisionPage = lazy(() => import("./components/status/DecisionPage"));
const SignUp = lazy(() => import("./pages/sign-up/SignUp"));
const LogIn = lazy(() => import("./pages/log-in/LogIn"));
const ForgotPass = lazy(() => import("./pages/forgot-pass/ForgotPass"));
const ResetPassCard = lazy(() => import("./pages/reset-pass/ResetPassCard"));
const Layout = lazy(() => import("./pages/Layout"));
const ApplicationPage = lazy(() => import("./pages/applicant/ApplicationPage"));
const AppOverview = lazy(() => import("./pages/applicant/AppOverview"));
const AppSubmitted = lazy(
  () => import("./pages/applicant/app-submitted/AppSubmitted"),
);
const AppSubmitPage = lazy(() => import("./pages/applicant/AppSubmitPage"));
const AppReviewPage = lazy(() => import("./pages/applicant/AppReviewPage"));
const InterviewPage = lazy(() => import("./pages/reviewer/InterviewPage"));
const UserRolePage = lazy(
  () => import("./pages/super-reviewer/dashboards/UserRolePage"),
);
const ReviewerApplicationsDashboard = lazy(
  () => import("./pages/reviewer/ReviewerApplicationsDashboard"),
);
const AdminHome = lazy(() => import("./pages/super-reviewer/AdminHome"));
const SuperReviewerDashboardShell = lazy(
  () => import("./pages/super-reviewer/dashboards/SuperReviewerDashboardShell"),
);
const UnderReviewDashboard = lazy(
  () => import("./pages/super-reviewer/dashboards/UnderReviewDashboard"),
);
const AssignedReviewsPage = lazy(() =>
  import("./pages/super-reviewer/dashboards/AssignedReviewsPage").then(
    (module) => ({
      default: module.AssignedReviewsPage,
    }),
  ),
);
const AssignedApplicationsPage = lazy(() =>
  import("./pages/super-reviewer/dashboards/AssignedApplicationsPage").then(
    (module) => ({
      default: module.AssignedApplicationsPage,
    }),
  ),
);
const AppRevisitPage = lazy(() => import("./pages/applicant/AppRevisitPage"));
const QualifiedApplicationsDashboard = lazy(
  () =>
    import("./pages/super-reviewer/dashboards/QualifiedApplicationsDashboard"),
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ViewApplicationPage = lazy(
  () => import("./pages/super-reviewer/ViewApplicationPage"),
);
const ReviewerDashboardShell = lazy(
  () => import("./pages/reviewer/ReviewerDashboardShell"),
);
const SuperReviewerReviewersDashboard = lazy(
  () =>
    import("./pages/super-reviewer/dashboards/SuperReviewerReviewersDashboard"),
);
const ReviewerInterviewsDashboard = lazy(
  () => import("./pages/reviewer/ReviewerInterviewsDashboard"),
);
const FormValidationPage = lazy(() =>
  import("./pages/super-reviewer/FormValidationPage").then((module) => ({
    default: module.FormValidationPage,
  })),
);
const SuperReviewerInterviewersDashboard = lazy(
  () =>
    import(
      "./pages/super-reviewer/dashboards/SuperReviewerInterviewersDashboard"
    ),
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer
          position="bottom-right"
          toastClassName={() => "bg-transparent shadow-none border-none mb-3"}
        />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<Layout />}>
              <Route element={<Navigate to="/login" />} />

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
                      <AppOverview />
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
                  path="decision/:responseId/:role"
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
                    element={<UnderReviewDashboard />}
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
                    path="review/f/:formId/:responseId/:sectionId/:reviewDataId"
                    element={<AppReviewPage />}
                  />
                  <Route
                    path="interview/f/:formId/:responseId/:interviewDataId"
                    element={<InterviewPage />}
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
