import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB444A4NvWMrWkoZE3vTheI9sihS9BVsNM",
  authDomain: "ai-planner-app-b1051.firebaseapp.com",
  projectId: "ai-planner-app-b1051",
  storageBucket: "ai-planner-app-b1051.firebasestorage.app",
  messagingSenderId: "412830865951",
  appId: "1:412830865951:web:7d1d32025b5f960085532a",
  measurementId: "G-88SRJBKED2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
