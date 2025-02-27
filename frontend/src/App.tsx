import { Route, Routes } from 'react-router-dom';

import StatusPage from './components/status/StatusPage';
import DecisionPage from './components/status/DecisionPage';
import ReviewDashboard from './pages/ReviewDashboard';
import ApplicantDetails from "./pages/ApplicantDetails"

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatusPage />}></Route>
      <Route path="/application" element={<StatusPage />}></Route>
      <Route path="/status" element={<StatusPage />}></Route>
      <Route path="/status/decision" element={<DecisionPage />}></Route>
      <Route path="/admin" element={<ReviewDashboard />}></Route>
      <Route path="/admin/applicant/:id" element={<ApplicantDetails />} />
    </Routes>
  )
}

export default App;
