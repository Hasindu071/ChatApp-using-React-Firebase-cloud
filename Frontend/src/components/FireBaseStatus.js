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
        setStatus(response.data.status);
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
          padding: "10px",
          backgroundColor: serverStatus.includes("✅") ? "green" : "red",
          color: "white",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {serverStatus}
      </div>
      <div
        style={{
          padding: "10px",
          backgroundColor: status.includes("✅") ? "green" : "red",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    </div>
  );
};

export default FirebaseStatus;
