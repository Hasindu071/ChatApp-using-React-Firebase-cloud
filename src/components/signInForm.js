import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";


import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success ("user ligged in successfullly! ");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <hr></hr>
      <form onSubmit={handleLogin}>
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
            //onClick={toggleForm} // Call the `toggleForm` function on click
          >
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
