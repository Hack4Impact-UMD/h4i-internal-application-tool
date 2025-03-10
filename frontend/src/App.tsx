import { Route, Routes } from 'react-router-dom';

import StatusPage from './components/status/StatusPage';
import DecisionPage from './components/status/DecisionPage';
import ReviewDashboard from './pages/ReviewDashboard';
import ApplicantDetails from "./pages/ApplicantDetails"
import SignUp from './pages/SignUp/SignUp';
import LogIn from './pages/LogIn/LogIn';
import ForgotPass from "./pages/ForgotPass/ForgotPass"
import ResetPassCard from './pages/ResetPass/ResetPassCard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatusPage />}></Route>
      <Route path="/application" element={<StatusPage />}></Route>
      <Route path="/status" element={<StatusPage />}></Route>
      <Route path="/status/decision" element={<DecisionPage />}></Route>
      <Route path="/admin" element={<ReviewDashboard />}></Route>
      <Route path="/admin/applicant/:id" element={<ApplicantDetails />} />
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/login" element={<LogIn />}></Route>
      <Route path="/forgotpassword" element={<ForgotPass />}></Route>
      <Route path="/resetpassword" element={<ResetPassCard />}></Route>
    </Routes>
  )
}

export default App;