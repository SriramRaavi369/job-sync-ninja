
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "jobsyncninja",
  appId: "1:103084587537:web:6368c9a4b2410ef585cfb0",
  storageBucket: "jobsyncninja.appspot.com",
  apiKey: "AIzaSyCKUDdF4DhD_wKaLIO8USVPxN63saH8mGA",
  authDomain: "jobsyncninja.firebaseapp.com",
  messagingSenderId: "103084587537",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
