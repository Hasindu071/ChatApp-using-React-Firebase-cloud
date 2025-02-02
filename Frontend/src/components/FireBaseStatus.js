import React, { useState, useEffect } from "react";
import axios from "axios";

const FirebaseStatus = () => {
  const [status, setStatus] = useState("Checking Firebase...");
  const [serverStatus, setServerStatus] = useState("Checking server...");

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get("http://localhost:5000/health"); // New API to check server health
        setServerStatus("✅ Server is running");
      } catch (error) {
        setServerStatus("❌ Server is DOWN!");
        return; // Stop further Firebase check if server is down
      }

      checkFirebase();
    };

    const checkFirebase = async () => {
      try {
        const response = await axios.get("http://localhost:5000/firebase-health");
        setStatus(response.data.status); // Get Firebase status response
      } catch (error) {
        setStatus("❌ Unable to check Firebase! (Server issue)");
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 10000); // Check every 10 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <div
        style={{
          padding: "8px 15px",
          backgroundColor: serverStatus.includes("✅") ? "#4CAF50" : "#F44336",
          color: "white",
          borderRadius: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          display: "inline-block",
          marginBottom: "8px",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {serverStatus}
      </div>
      <div
        style={{
          padding: "8px 15px",
          backgroundColor:
            status.includes("✅") || status.includes("Firebase is connected")
              ? "#4CAF50"
              : "#F44336",
          marginLeft: "20px",
          color: "white",
          borderRadius: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          display: "inline-block",
          fontSize: "12px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {status}
      </div>
    </div>
  );
};


export default FirebaseStatus;
