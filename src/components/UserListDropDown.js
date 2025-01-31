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
      const usersData = snapshot.docs.map(doc => doc.data());

      // Filter out the logged-in user and already added group members
      const filteredUsers = usersData.filter(
        user => user.uid !== currentUserUID && !groupMembers.some(member => member.uid === user.uid)
      );

      setUsers(filteredUsers);
    });

    return () => unsubscribe();
  }, [currentUserUID, groupMembers]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <h5 style={{ color: "rgb(6, 54, 56, 0.6)", marginLeft: "15px", marginBottom : "2px" }}>Group Info</h5>
      <label htmlFor="users" style={{ color: "black", marginLeft: "15px", fontSize : "13px"}}>Select a User to add  : </label>
      <select
        id="users"
        onChange={(e) => {
          const selectedUser = users.find(user => user.uid === e.target.value);
          if (selectedUser) {
            onSelectUser(selectedUser);
          }
        }}
      >
        <option value=""> Select a User  </option>
        {users.map(user => (
          <option key={user.uid} value={user.uid}>
            {user.displayName}
          </option>
        ))}
      </select>
      <h5 style={{ color: "black", marginLeft: "15px", marginTop : "5px"}}>Group Members</h5>
    </div>
  );
};

export default UsersDropdown;
