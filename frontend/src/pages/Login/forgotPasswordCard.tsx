import React from "react";
import "./logincard.css";

interface ForgotPasswordCardProps {
  title: string;
  prompt: string;
}

const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({
  title,
  prompt,
}) => {
  return (
    <div className="boxed centered">
      <h1 className="title">{title}</h1>
      <p className="prompt">{prompt}</p>
      <input
        type="email"
        placeholder="Enter your email"
        className="textbox"
      />
      <button className="button">Reset Password</button>
      <a href="/login" className="switch-link">
        Back to Login
      </a>
    </div>
  );
};

export default ForgotPasswordCard;
