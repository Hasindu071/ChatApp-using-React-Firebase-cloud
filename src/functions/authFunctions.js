// /functions/authFunctions.js
import { auth } from "../components/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";


// Sign Up function
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    return true;
  } catch (error) {
    console.error("Error signing up:", error.message);
    return false;
  }
};

// Sign In function
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return true;
  } catch (error) {
    console.error("Error signing in:", error.message);
    return false;
  }
};

// Sign Out function
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

export { signUp, signIn, signOutUser };
