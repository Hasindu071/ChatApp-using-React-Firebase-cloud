// /App.js
import React, { useState, useEffect } from "react";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./components/Auth/SignOutButton";
import SignUpForm from "./components/Auth/signUpForm";

const App = () => {
  const [user, setUser] = useState(null);
  //state variable which saves the currunt authenticated user
  //if user is not authenticated it is null

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
        {/* if the user is authenticated */}
          <h1>Welcome, {user.email}</h1>
          <SignOutButton />
        </div>
      ) : (
        <div>
        {/* if the user is not authenticated */}
          <h1>Authentication</h1>
          <SignUpForm />
        </div>
      )}
    </div>
  );
};

export default App;
