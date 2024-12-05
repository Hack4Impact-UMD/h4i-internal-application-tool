import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import firebaseConfig from "../../../../backend/config/firebase";

// Initialize Firebase app
let firebaseApp: FirebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig as FirebaseOptions);
} catch (error) {
  firebaseApp = getApp(); // If the app is already initialized, get the existing app
  console.error("App is already initialized error:", error.message);
}

const SignupCard = () => {
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const passwordRequirements = `Invalid password. Please ensure your password meets the following requirements:\n
    - At least 8 characters long\n
    - At least one uppercase letter (A-Z)\n
    - At least one lowercase letter (a-z)\n
    - At least one digit (0-9)\n
    - At least one special character (e.g., @$!%*?&#)\n
    `;

  const validateTerpMailAddress = (email: string) => {
    const terpmailRegex = /^[a-zA-Z0-9]+@terpmail\.umd\.edu$/;
    return terpmailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  // Update the email address input value on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupEmail(e.target.value);
  };

  // Update the password input value on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Set the passwordError value to be what is required of a password.
    setSignupPassword(e.target.value);

    if (!validatePassword(e.target.value)) {
      setPasswordError(passwordRequirements);
    }
  };

  const handleSignupSubmit = async () => {
    const auth = getAuth(firebaseApp);
    // const firestore = getFirestore(firebaseApp);
    const validEmail = validateTerpMailAddress(signupEmail);
    const validPassword = validatePassword(signupPassword);

    if (!validEmail || !validPassword) {
      setEmailError(!validEmail ? "Enter a valid terpmail address." : "");
      setPasswordError(!validPassword ? passwordRequirements : "");
      // console.log("Invalid inputs");
      return;
    }

    // console.log("Valid inputs");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      console.log(userCredential);

      //const user = userCredential.user;

      // Retrieve user data from Firestore
      // const userDocRef = doc(firestore, "users", user.uid);
      // const userDoc = await getDoc(userDocRef);

      // if (userDoc.exists()) {
      //   const userData = userDoc.data();
      //   // setUserType(userData?.userType || null);
      //   // console.log(userData.userType);
      //   // setSchoolDistrictId(userData?.schoolDistrictId || "Unknown");
      //   console.log(userData.schoolDistrictId);
      // } else {
      //   setSignupError("User data not found");
      // }

      // Placeholder for actual action
      // This should check the validity of the inputs in the textboxes
      // Either throw an error or log the user in
      setSignupEmail("");
      setSignupPassword("");
      setEmailError("");
      setPasswordError("");
      alert(`${signupEmail} signed up!`);
    } catch (error) {
      //setCurrentPage("wrong");
      console.error("Signup error:", error.message, "caught.");
      setSignupError("Signup error: " + error.message + " caught.");
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
          Admin Sign Up
        </a>
      </p>
      <div className="centered">
        <h1 className="title">Applicant Sign Up</h1>
        <h3 className="prompt">Enter your info</h3>
        {/*Textbox to enter email address*/}
        <input
          type="email"
          value={signupEmail}
          onChange={handleEmailChange}
          placeholder={`Email address`}
          className={`textbox ${emailError ? "error" : ""}`}
        />
        {emailError && <div className="error-message">{emailError}</div>}
        {/*Textbox to enter password*/}
        <input
          type="password"
          value={signupPassword}
          onChange={handlePasswordChange}
          placeholder={`Password`}
          className={`textbox ${passwordError ? "error" : ""}`}
        />
        {passwordError && <div className="error-message">{passwordError}</div>}

        <button onClick={handleSignupSubmit} className="button">
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
      {signupError && <div className="error-message">{signupError}</div>}
    </div>
  );
};

export default SignupCard;
