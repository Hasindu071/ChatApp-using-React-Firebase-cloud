import React, { useState } from "react";
import UsersList from "./UserList";  // Import the UsersList component

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);  // Set the selected user
    console.log("Selected user: ", user);  // You can handle this as needed (e.g., start a chat)
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <UsersList onSelectUser={handleSelectUser} />
      {selectedUser && (
        <div>
          <h3>Selected User:</h3>
          <p>{selectedUser.displayName}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
