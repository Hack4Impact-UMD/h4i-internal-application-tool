import React, { useState } from "react";
import "./LoginCard.css";

import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import {
  getAuth,
  // sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from "../../../../backend/config/firebase";

interface LoginCardProps {
  title: string;
  otherTitle: string;
  prompt: string;
}

// Initialize Firebase app
let firebaseApp: FirebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig as FirebaseOptions);
} catch (error) {
  firebaseApp = getApp(); // If the app is already initialized, get the existing app
  console.error("App is already initialized error:", error.message);
}

function LoginCard({ title, otherTitle, prompt }: LoginCardProps) {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // Update the email address input value on change
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(event.target.value);
  };

  // Update the password input value on change
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(event.target.value);
  };

  // Handle button click
  const handleClick = async () => {
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    // Validation rules, have better checking for email and password.
    if (!loginEmail || !loginPassword) {
      setEmailError(!loginEmail ? "Enter a valid email address." : "");
      setPasswordError(!loginPassword ? "Enter a valid password." : "");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;

      // Retrieve user data from Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // setUserType(userData?.userType || null);
        // console.log(userData.userType);
        // setSchoolDistrictId(userData?.schoolDistrictId || "Unknown");
        console.log(userData.schoolDistrictId);
      } else {
        setLoginError("User data not found");
      }

      // Placeholder for actual action
      // This should check the validity of the inputs in the textboxes
      // Either throw an error or log the user in
      setLoginEmail("");
      setLoginPassword("");
      setEmailError("");
      setPasswordError("");
      alert(`${loginEmail} logged in! ${prompt}`);
    } catch (error) {
      //setCurrentPage("wrong");
      console.error("Login error:", error.message, "caught.");
      setLoginError("Login error: " + error.message + " caught.");
      setEmailError("");
      setPasswordError("");
    }
  };

  return (
    <div className="boxed">
      <p>
        {/*<Link to="/login">I don't know the company domain</Link>*/}
        {/*Placeholder for switching to admin login view*/}
        <a
          href="https://www.figma.com/design/Nb7ipRTxIbdi6QclO5p6md/Hack4Impact?node-id=120-237&node-type=frame"
          target="_blank"
          rel="noopener noreferrer"
          className="switch-link"
        >
          {otherTitle}
        </a>
      </p>
      <div className="centered">
        <h1 className="title">{title}</h1>
        <h3 className="prompt">Enter your login info</h3>
        {/*Textbox to enter email address*/}
        <input
          type="text"
          value={loginEmail}
          onChange={handleEmailChange}
          placeholder={`Email address`}
          className={`textbox ${emailError ? "error" : ""}`}
        />
        {emailError && <div className="error-message">{emailError}</div>}
        {/*Textbox to enter password*/}
        <input
          type="password"
          value={loginPassword}
          onChange={handlePasswordChange}
          placeholder={`Password`}
          className={`textbox ${passwordError ? "error" : ""}`}
        />
        {passwordError && <div className="error-message">{passwordError}</div>}

        <button onClick={handleClick} className="button">
          Continue
        </button>
        <p>
          {/*<Link to="/login">I don't know the company domain</Link>*/}
          {/*Placeholder for link to page that helps with company domain*/}
          <a
            href="https://www.figma.com/design/Nb7ipRTxIbdi6QclO5p6md/Hack4Impact?node-id=120-237&node-type=frame"
            target="_blank"
            rel="noopener noreferrer"
            className="domain-link"
          >
            I don't know the company domain
          </a>
        </p>
      </div>
      {loginError && <div className="error-message">{loginError}</div>}
    </div>
  );
}

export default LoginCard;
