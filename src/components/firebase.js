import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgq9MWtrMEEfjkafpwD5OkoH-lsXjYyMs",
  authDomain: "cloud-app-d3ed5.firebaseapp.com",
  projectId: "cloud-app-d3ed5",
  storageBucket: "cloud-app-d3ed5.firebasestorage.app",
  messagingSenderId: "320709716835",
  appId: "1:320709716835:web:ae3eb01124c6959690c156",
  measurementId: "G-1CYHZVL04W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // For user authentication
const db = getFirestore(app); // For Firestore database

export { auth, db };
