import { Navigate, Route, Routes } from 'react-router-dom';

import StatusPage from './components/status/StatusPage';
import DecisionPage from './components/status/DecisionPage';
import ReviewDashboard from './pages/ReviewDashboard';
import ApplicantDetails from "./pages/ApplicantDetails"
import SignUp from './pages/SignUp/SignUp';
import LogIn from './pages/LogIn/LogIn';
import ForgotPass from "./pages/ForgotPass/ForgotPass"
import ResetPassCard from './pages/ResetPass/ResetPassCard';
import AuthProvider from './components/providers/AuthProvider';
import RequireAuth from './components/auth/RequireAuth';
import Layout from './pages/Layout';
import RequireNoAuth from './components/auth/RequireNoAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" />} />

          <Route path="/apply">
            <Route index element={
              <RequireAuth>
                <p>Overview page goes here</p>
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
              <RequireAuth requireRoles={["reviewer", "super-reviewer"]}>
                <ReviewDashboard />
              </RequireAuth>
            } />
            <Route path="/admin/applicant/:id" element={
              <RequireAuth requireRoles={["reviewer", "super-reviewer"]}>
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
  )
}

export default App;
