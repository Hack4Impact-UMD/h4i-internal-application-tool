import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import StatusPage from './components/status/StatusPage';
import DecisionPage from './components/status/DecisionPage';
// import ReviewDashboard from './pages/ReviewDashboard';
import ApplicantDetails from "./pages/ApplicantDetails"
import SignUp from './pages/SignUp/SignUp';
import LogIn from './pages/LogIn/LogIn';
import ForgotPass from "./pages/ForgotPass/ForgotPass"
import ResetPassCard from './pages/ResetPass/ResetPassCard';
import AuthProvider from './components/providers/AuthProvider';
import RequireAuth from './components/auth/RequireAuth';
import Layout from './pages/Layout';
import RequireNoAuth from './components/auth/RequireNoAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminPlaceholderPage from './components/reviewer/AdminPlaceholderPage';
import { PermissionRole } from './types/types';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" />} />

            <Route path="/apply">
              <Route index element={
                <RequireAuth>
                  <p>Overview page goes here.
                    <NavLink className="text-darkblue" to="/apply/status">
                      Go to /apply/status
                    </NavLink>
                  </p>
                </RequireAuth>
              }></Route>
              <Route path="/apply/status" element={
                <RequireAuth>
                  <StatusPage />
                </RequireAuth>
              } />
              <Route path="/apply/decision" element={
                <RequireAuth>
                  <DecisionPage />
                </RequireAuth>
              }></Route>
            </Route>

            <Route path="/admin">
              <Route index element={
                <RequireAuth requireRoles={[PermissionRole.Reviewer, PermissionRole.SuperReviewer]}>
                  <AdminPlaceholderPage />
                </RequireAuth>
              } />
              <Route path="/admin/applicant/:id" element={
                <RequireAuth requireRoles={[PermissionRole.Reviewer, PermissionRole.SuperReviewer]}>
                  <ApplicantDetails />
                </RequireAuth>
              } />
            </Route>
          </Route>
          <Route path="/signup" element={
            <RequireNoAuth redirect={
              {
                applicant: "/apply",
                reviewer: "/admin",
                "super-reviewer": "/admin"
              }
            }>
              <SignUp />
            </RequireNoAuth>
          } />
          <Route path="/login" element={
            <RequireNoAuth redirect={
              {
                applicant: "/apply",
                reviewer: "/admin",
                "super-reviewer": "/admin"
              }
            }>
              <LogIn />
            </RequireNoAuth>
          } />
          <Route path="/forgotpassword" element={<ForgotPass />}></Route>
          <Route path="/resetpassword" element={<ResetPassCard />}></Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
