// /App.js
import React, { useState, useEffect } from "react";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignUpForm from "./components/Auth/signUpForm";
import SignInForm from "./components/Auth/signInForm";
import SignOutButton from "./components/Auth/SignOutButton";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <SignOutButton />
        </div>
      ) : (
        <div>
          <h1>Authentication</h1>
          <SignInForm />
          <SignUpForm />
        </div>
      )}
    </div>
  );
};

export default App;
