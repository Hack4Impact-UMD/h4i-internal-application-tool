import React from "react";
import "./login.css";
import LoginCard from "./LoginCard.tsx";

function Login() {
  return (
    <div className="card">
      <LoginCard
        title="Applicant Login"
        otherTitle="Admin Login"
        prompt="Company Domain"
      />
    </div>
  );
}

export default Login;
