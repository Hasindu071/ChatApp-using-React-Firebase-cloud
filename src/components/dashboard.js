import React, { useState } from "react";
import UsersList from "./UserList";
import { db, auth } from "./firebase"; // Correct import path
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.uid);  // Fetch chat messages when user is selected
  };

  const fetchMessages = (receiverId) => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => (msg.senderId === receiverId || msg.receiverId === receiverId));
      setMessages(fetchedMessages);
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: auth.currentUser.uid,  // Replace with actual logged-in user ID
        senderName: auth.currentUser.displayName, // Assuming displayName is available
        receiverId: selectedUser.uid,
        timestamp: new Date()
      });

      setNewMessage("");  // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
              {messages.map((message) => (
                <div key={message.id} className="message">
                  <p><strong>{message.senderName}</strong> <span>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</span></p>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
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