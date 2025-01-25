// /components/Auth/SignUpForm.js
import React, { useState } from "react";
import { signUp } from "../../functions/authFunctions";
import "../../styles/signUpForm.css";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(email, password);
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="lab">Email:</label>
        <input
          id = "email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <label htmlFor="password" className="lab">Password</label>
        <input
          id = "password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <button type="submit">Sign Up</button>

        <p > Haven't sign up yet ? login here</p>

      </form>
    </div>
  );
};

export default SignUpForm;
