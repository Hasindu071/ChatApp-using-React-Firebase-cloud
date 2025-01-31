import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UsersDropdown = ({ onSelectUser, groupMembers }) => {
  const [users, setUsers] = useState([]);
  const auth = getAuth();
  const currentUserUID = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => doc.data());

      // Filter out the logged-in user and already added group members
      const filteredUsers = usersData.filter(
        (user) =>
          user.uid !== currentUserUID &&
          !groupMembers.some((member) => member.uid === user.uid)
      );

      setUsers(filteredUsers);
    });

    return () => unsubscribe();
  }, [currentUserUID, groupMembers]);

  return (
    <div
      style={{
        marginBottom: "15px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "5px 5px 15px rgba(0,0,0,0.15)",
        maxWidth: "320px",
        textAlign: "center",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <h5
        style={{
          color: "#fff",
          fontSize: "18px",
          fontWeight: "bold",
          letterSpacing: "1px",
          padding: "10px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "5px",
        }}
      >
        Group Info
      </h5>

      <label
        htmlFor="users"
        style={{
          color: "#fff",
          fontSize: "14px",
          display: "block",
          marginBottom: "8px",
        }}
      >
        Select a User to add:
      </label>

      <select
        id="users"
        onChange={(e) => {
          const selectedUser = users.find((user) => user.uid === e.target.value);
          if (selectedUser) {
            onSelectUser(selectedUser);
          }
        }}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "5px",
          border: "none",
          background: "#fff",
          color: "#333",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.3s ease",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <option value="">Select a User</option>
        {users.map((user) => (
          <option key={user.uid} value={user.uid}>
            {user.displayName}
          </option>
        ))}
      </select>

      <h5
        style={{
          color: "#fff",
          marginTop: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "8px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "5px",
        }}
      >
        Group Members
      </h5>
      <button style={{ 
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
}}>
  Exit
</button>
    </div>
  );
};

export default UsersDropdown;
