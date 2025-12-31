import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debugging: Check if config is loaded
console.log("Firebase Config Check:", {
  apiKey: firebaseConfig.apiKey ? "Present" : "MISSING",
  authDomain: firebaseConfig.authDomain ? "Present" : "MISSING",
  projectId: firebaseConfig.projectId ? "Present" : "MISSING",
});

if (!firebaseConfig.apiKey) {
  alert("CRITICAL ERROR: Firebase API Key is missing! Check .env file.");
}

// Yahan 'export' hona bahut zaroori hai
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);