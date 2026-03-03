import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBZgIC-mROS2MQDQBH3B0EvjiXjWQjgADk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-isafadilfaridagus.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-isafadilfaridagus",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-isafadilfaridagus.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1063819869073",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1063819869073:web:75822260c60c2d29b37830"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);
