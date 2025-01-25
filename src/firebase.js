// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDApe1Hz7vRBmvjNCLz3Z_93aYUQYOdRxY",
  authDomain: "cloud-chat-application-77b8f.firebaseapp.com",
  projectId: "cloud-chat-application-77b8f",
  storageBucket: "cloud-chat-application-77b8f.firebasestorage.app",
  messagingSenderId: "875949770085",
  appId: "1:875949770085:web:a160aa502ca11e4d6d0d8c",
  measurementId: "G-ME27PBRQPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);