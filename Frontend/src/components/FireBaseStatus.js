import React, { useState, useEffect } from "react";
import axios from "axios";

const FirebaseStatus = () => {
  const [status, setStatus] = useState("Checking Firebase...");

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        const response = await axios.get("http://localhost:5000/firebase-health");
        setStatus(response.data.status);
      } catch (error) {
        setStatus("❌ Unable to connect to Firebase!");
      }
    };

    checkFirebase();
    const interval = setInterval(checkFirebase, 10000); // Check every 10 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "10px",
        textAlign: "center",
        backgroundColor: status.includes("✅") ? "green" : "red",
        color: "white",
        fontWeight: "bold",
      }}
    >
      {status}
    </div>
  );
};

export default FirebaseStatus;
