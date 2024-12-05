import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB7FYsjDJiszoQaUnFADEZxPPTQJ2px8W0",
    authDomain: "h4i-applications.firebaseapp.com",
    projectId: "h4i-applications",
    storageBucket: "h4i-applications.appspot.com",
    messagingSenderId: "361966602736",
    appId: "1:361966602736:web:05a21adddb85e54eebf535",
    measurementId: "G-FS170BH0BM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// adding authentification (testing purposes)
const auth = getAuth(app);
const database = getDatabase(app);


export { app, analytics, auth, database };