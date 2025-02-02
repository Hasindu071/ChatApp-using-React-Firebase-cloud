import { useEffect, useState } from "react";
import { db } from "./firebase"; // Import Firebase config from firebase.js
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import "../styles/dashboard.css"; // Ensure you create this CSS file for styling
import api from "../services/api";

// Get all the users in the datastore into the chat
const UsersList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to track selected user
  const auth = getAuth(); // Get the Firebase auth instance
  const currentUserUID = auth.currentUser?.uid; // Get logged-in user's UID

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await api.getUsers();
        setUsers(userData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Get real-time data from Firestore
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => doc.data());

      // Filter out the logged-in user from the list
      const filteredUsers = usersData.filter(
        (user) => user.uid !== currentUserUID
      );

      setUsers(filteredUsers); // Set the filtered data to state
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [currentUserUID]); // Re-run when the current user's UID changes

  // Handle selecting a user
  const handleSelectUser = (user) => {
    setSelectedUser(user); // Set the clicked user as the selected user
    onSelectUser(user); // Pass the selected user to the parent component
  };

  return (
    <div
      style={{
        backgroundColor: "#0d615d33",
        padding: "10px",
        borderRadius: "20px",
      }}
    >
      <h3 style={{ backgroundColor: "" }}>Users</h3>
      <ul className="userlist">
        {users.map((user) => (
          <li
            key={user.uid}
            onClick={() => handleSelectUser(user)}
            className={`userlist-item ${
              selectedUser?.uid === user.uid ? "selected" : ""
            }`}
          >
            {user.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
