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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update user state based on authentication

    });
    return unsubscribe; // Clean up the listener on component unmount
  }, []);

  return (
    <div>
    {isAuthenticated ? ( // ✅ Check if user is authenticated instead of just user state
      <div>
        <ChatPage user={user} />
        <SignOutButton onSignOut={() => setIsAuthenticated(false)} /> {/* Reset state on sign out */}
      </div>
    ) : (
      <div>
        {isSignUp ? (
          <SignUpForm toggleForm={() => setIsSignUp(false)} />
        ) : (
          <SignInForm toggleForm={() => setIsSignUp(true)} onLogin={() => setIsAuthenticated(true)} />
        )}
      </div>
    )}
  </div>
  );
};

export default App;
