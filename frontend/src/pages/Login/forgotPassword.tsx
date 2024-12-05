import React from "react";
import ForgotPasswordCard from "./forgotPasswordCard";
import "./login.css";

const ForgotPassword = () => {
  return (
    <div className="card">
      <ForgotPasswordCard
        title="Forgot Password Page"
        prompt="Please enter your email to reset your password."
      />
    </div>
  );
};

export default ForgotPassword;
