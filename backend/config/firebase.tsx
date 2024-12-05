import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7FYsjDJiszoQaUnFADEZxPPTQJ2px8W0",
  authDomain: "h4i-applications.firebaseapp.com",
  projectId: "h4i-applications",
  storageBucket: "h4i-applications.appspot.com",
  messagingSenderId: "361966602736",
  appId: "1:361966602736:web:05a21adddb85e54eebf535",
  measurementId: "G-FS170BH0BM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export default app;
