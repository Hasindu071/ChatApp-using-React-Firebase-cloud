// /App.js
import React, { useState, useEffect } from "react";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./components/Auth/SignOutButton";
import SignUpForm from "./components/Auth/signUpForm";
import SignInForm from "./components/Auth/signInForm";

const App = () => {
  const [user, setUser] = useState(null); // State for authenticated user
  const [isSignUp, setIsSignUp] = useState(true); // State for toggling between sign-up and login forms

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update user state based on authentication
    });
    return unsubscribe; // Clean up the listener on component unmount
  }, []);

  return (
    <div>
      {user ? (
        <div>
          {/* If the user is authenticated */}
          <h1>Welcome, {user.email}</h1>
          <SignOutButton />
        </div>
      ) : (
        <div>
          {/* If the user is not authenticated */}
          {isSignUp ? (
            <SignUpForm toggleForm={() => setIsSignUp(false)} /> // Pass toggle function to sign-up form
          ) : (
            <SignInForm toggleForm={() => setIsSignUp(true)} /> // Pass toggle function to login form
          )}
        </div>
      )}
    </div>
  );
};

export default App;
