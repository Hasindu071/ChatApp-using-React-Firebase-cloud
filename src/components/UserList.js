import { useEffect, useState } from "react";
import { db } from "./firebase";  // Import Firebase config from firebase.js
import { collection, onSnapshot } from "firebase/firestore";

// Get all the users in the dtastore into the chat
const UsersList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get real-time data from Firestore
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data());
      setUsers(usersData);  // Set the fetched data to state
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <button key={user.uid} onClick={() => onSelectUser(user)}>
          {user.displayName}
        </button>
      ))}
    </div>
  );
};

export default UsersList;
