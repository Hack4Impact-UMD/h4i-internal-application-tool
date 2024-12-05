import { Route, Routes } from 'react-router-dom';

import StatusPage from './components/status/StatusPage';
import DecisionPage from './components/status/DecisionPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <StatusPage /> }></Route>
      <Route path="/application" element={ <StatusPage /> }></Route>
      <Route path="/status" element={ <StatusPage /> }></Route>
      <Route path="/status/decision" element={ <DecisionPage /> }></Route>
    </Routes>
  )
}

export default App;