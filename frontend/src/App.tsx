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
import AppSubmitted from "./pages/AppSubmitted/AppSubmitted";
import Review from "./pages/Review.tsx"

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
          <Route 
            path="/review"
            element={
                <Review />
            }
          />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
