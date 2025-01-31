import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UsersDropdown = ({ onSelectUser, groupMembers, selectedGroup }) => {
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft:"15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label
          htmlFor="users"
          style={{
            fontSize: "14px",
            color : "rgba(6, 54, 56, 0.8)",
            marginTop:"18px"
          }}
        >
          Select a User to add to the group:
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
        width: "250px",
        padding: "5px",
        color : "rgba(6, 54, 56, 0.6)",
        borderRadius: "5px",
        border: "1px solid rgba(6, 54, 56, 0.2)",
        cursor: "pointer",
        outline: "none",
        transition: "all 0.3s ease",
        marginTop: "15px"
      }}
    >
      <option value="">Select a User</option>
      {users.map((user) => (
        <option key={user.uid} value={user.uid}>
          {user.displayName}
        </option>
      ))}
    </select>
  </div>
  <div>
  <p style={{ fontSize: "14px", color : "rgba(6, 54, 56, 0.8)" }}>
    <strong>Group members : </strong>{" "}
    {groupMembers.map((member, index) => (
      <React.Fragment key={member.id}>
        {member.displayName}
        {index < groupMembers.length - 1 && ", "}
      </React.Fragment>
    ))}
  </p>
</div>

</div>
  );
};

export default UsersDropdown;
