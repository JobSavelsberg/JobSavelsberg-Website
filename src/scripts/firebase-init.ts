// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyBvTMnYklW-JXr1j3Z9nt72MYamTSGvo2Y",
    authDomain: "jobsavelsberg-website.firebaseapp.com",
    projectId: "jobsavelsberg-website",
    storageBucket: "jobsavelsberg-website.firebasestorage.app",
    messagingSenderId: "757986505190",
    appId: "1:757986505190:web:b9eea97fea1a1abb49a627",
    measurementId: "G-6RG0HYJ74K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
