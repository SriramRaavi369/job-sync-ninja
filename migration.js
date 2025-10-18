
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, writeBatch } from "firebase/firestore";

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

async function migrateJobs() {
    const jobsCollection = collection(db, "jobs");
    const querySnapshot = await getDocs(jobsCollection);
    const batch = writeBatch(db);

    querySnapshot.forEach(document => {
        const job = document.data();
        if (typeof job.posted_at === 'string') {
            const newDate = new Date(job.posted_at);
            const jobRef = doc(db, "jobs", document.id);
            batch.update(jobRef, { posted_at: newDate });
        }
    });

    await batch.commit();
    console.log("Migration complete!");
}

migrateJobs();
