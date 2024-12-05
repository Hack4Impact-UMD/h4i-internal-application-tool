import React, { useState } from "react";

interface EmailProps {
  value: string;
  onChange: (email: string) => void;
}

const Email: React.FC<EmailProps> = ({ value, onChange }) => {
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onChange(email);
    setIsValid(validateEmail(email));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="form-input-container">
      <label htmlFor="email" className="form-label">
        Email:<span className="red-text">*</span>
      </label>
      <input
        type="email"
        id="email"
        className="form-input"
        required
        value={value}
        onChange={handleEmailChange}
        placeholder="Enter your email"
        style={{ borderColor: isValid ? "" : "red" }}
      />
      {!isValid && <span className="red-text">Please enter a valid email.</span>}
    </div>
  );
};

export default Email;
