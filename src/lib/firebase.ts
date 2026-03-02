import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyBZgIC-mROS2MQDQBH3B0EvjiXjWQjgADk",
  authDomain: "portfolio-isafadilfaridagus.firebaseapp.com",
  projectId: "portfolio-isafadilfaridagus",
  storageBucket: "portfolio-isafadilfaridagus.firebasestorage.app",
  messagingSenderId: "1063819869073",
  appId: "1:1063819869073:web:75822260c60c2d29b37830"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
