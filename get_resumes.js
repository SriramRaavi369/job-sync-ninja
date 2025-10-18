
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

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

async function getOneResume() {
  try {
    const resumesCollection = collection(db, "resumes");
    const q = query(resumesCollection, limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No resumes found.");
      return;
    }

    querySnapshot.forEach((doc) => {
      console.log("Found resume:", doc.data());
    });
  } catch (error) {
    console.error("Error getting resume:", error);
  }
}

getOneResume();
