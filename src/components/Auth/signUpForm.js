// /components/Auth/SignUpForm.js
import React, { useState } from "react";
import { signUp } from "../../functions/authFunctions";
import "../../styles/signUpForm.css";

const SignUpForm = ({ toggleForm }) => { // Accept `toggleForm` prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [ setError] = useState(null); // Define error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setError(null); // Clear previous errors
    const success = await signUp(email, password);
    
    if (success) {
      toggleForm(); // Switch to sign-in form only on success
    } else {
      console.error("Sign-up failed. Try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>

        {/* Add the clickable "login here" text */}
        <p>
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={toggleForm} // Call the `toggleForm` function on click
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
