import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage"

export const firebaseConfig = {
  apiKey: "AIzaSyB7FYsjDJiszoQaUnFADEZxPPTQJ2px8W0",
  authDomain: "h4i-applications.firebaseapp.com",
  projectId: "h4i-applications",
  storageBucket: "h4i-applications.appspot.com",
  messagingSenderId: "361966602736",
  appId: "1:361966602736:web:05a21adddb85e54eebf535",
  measurementId: "G-FS170BH0BM",
};

export const API_URL =
  import.meta.env.MODE == "development"
    ? "http://127.0.0.1:5001/h4i-applications/us-central1/api"
    : "THE PROD URL";

console.log(`CURRENTLY RUNNING IN ${import.meta.env.MODE} MODE!`);
console.log(`Using base API URL at: ${API_URL}`);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)

if (import.meta.env.MODE == "development") {
  console.log(`CONNECTING TO LOCAL FIREBASE EMULATORS!`);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
