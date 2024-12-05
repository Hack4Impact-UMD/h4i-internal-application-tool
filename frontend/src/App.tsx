// src/App.tsx
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login.tsx";
import Signup from "./pages/Login/Signup.tsx";
import ForgotPassword from "./pages/Login/forgotPassword.tsx";

function App() {
  return (
    <Router>
      <div className="login-container">
        <h1>Application Portal</h1>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* Add additional routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
