import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import StatusPage from "./components/status/StatusPage";
import DecisionPage from "./components/status/DecisionPage";
import ReviewDashboard from "./pages/ReviewDashboard";
import ApplicantDetails from "./pages/ApplicantDetails";
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
  ApplicationForm,
  PermissionRole,
} from "./types/types";
import ApplicationPreview from "./components/form/ApplicationPreview";
import { useEffect, useState } from "react";
import { getAllForms } from "./services/applicationFormsService";
import ApplicationCard from "./components/form/ApplicationCard";
import ApplicationPage from "./pages/ApplicationPage";
import Overview from "./pages/Overview/Overview";

const queryClient = new QueryClient();

function App() {
  const [forms, setForms] = useState<ApplicationForm[]>([]);

  useEffect(() => {
    async function fetchForms() {
      try {
        const fetchedForms = await getAllForms();
        setForms(fetchedForms);
        console.log("Fetched forms");
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    }

    fetchForms();
  }, []);

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
              {/* <Route */}
              {/*   path="/apply/:formId" */}
              {/*   element={ */}
              {/*     <RequireAuth> */}
              {/*       <ApplicationPreview /> */}
              {/*     </RequireAuth> */}
              {/*   } */}
              {/* /> */}
              <Route
                path="/apply/:applicationResponseId/:sectionId"
                element={
                  <RequireAuth>
                    <ApplicationPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/apply/status"
                element={
                  <RequireAuth requireRoles={[PermissionRole.Applicant]}>
                    <StatusPage />
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
              <Route
                path="/admin/applicant/:id"
                element={
                  <RequireAuth
                    requireRoles={[
                      PermissionRole.Reviewer,
                      PermissionRole.SuperReviewer,
                    ]}
                  >
                    <ApplicantDetails />
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
