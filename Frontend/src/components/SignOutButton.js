// /components/Auth/SignOutButton.js
import React from "react";
import { signOutUser } from "../functions/authFunctions";

const SignOutButton = () => {
  return <button onClick={signOutUser}>Sign Out</button>;
};

export default SignOutButton;
