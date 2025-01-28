// /App.js
import React, { useState, useEffect } from "react";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./components/Auth/SignOutButton";
import SignUpForm from "./components/Auth/signUpForm";
import SignInForm from "./components/Auth/signInForm";
import ChatPage from "./components/ChatPage";

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
          {/* If the user is authenticated, show ChatPage */}
          <ChatPage user={user} />
          <SignOutButton />
        </div>
      ) : (
        <div>
          {/* If the user is not authenticated, show SignUp or SignIn form */}
          {isSignUp ? (
            <SignUpForm toggleForm={() => setIsSignUp(false)} />
          ) : (
            <SignInForm toggleForm={() => setIsSignUp(true)} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
