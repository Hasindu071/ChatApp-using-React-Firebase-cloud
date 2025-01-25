// /components/Auth/SignInForm.js
import React, { useState } from "react";
import { signIn } from "../../functions/authFunctions";
import "../../styles/signUpForm.css";

const SignInForm = ({ toggleForm }) => { // Accept `toggleForm` prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="lab">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <label htmlFor="password" className="lab">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <button type="submit">Login</button>

        {/* Add the clickable "sign up here" text */}
        <p>
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={toggleForm} // Call the `toggleForm` function on click
          >
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
