import React, { useState } from "react";
import UsersList from "./UserList";  // Import the UsersList component
import "../styles/dashboard.css"; 
import "../styles/chatPage.css";      

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);  // Set the selected user
    console.log("Selected user: ", user);  // You can handle this as needed (e.g., start a chat)
  };

  return (
    <div className="dashboard">
      <div className="left-panel">
        <UsersList onSelectUser={handleSelectUser} />
      </div>
      <div className="right-panel">
        {selectedUser ? (
          <div className="chat-container">
            <div className="chat-header">
              <h3>Chat with {selectedUser.displayName}</h3>
            </div>
            <div className="chat-body">
              {/* Display chat messages here */}
              <p>Chat history will appear here.</p>
            </div>
            <div className="chat-footer">
              <input type="text" placeholder="Type a message" />
              <button>Send</button>
            </div>
          </div>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
