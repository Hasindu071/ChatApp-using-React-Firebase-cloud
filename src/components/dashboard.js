import React, { useState, useEffect } from "react";
import UsersList from "./UserList";
import { db, auth } from "./firebase"; // Correct import path
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, orderBy("name"));

    onSnapshot(q, (snapshot) => {
      const fetchedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(fetchedGroups);
    });
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    fetchMessages(user.uid);  // Fetch chat messages when user is selected
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    fetchGroupMessages(group.id);  // Fetch group messages when group is selected
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

  const fetchGroupMessages = (groupId) => {
    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || (!selectedUser && !selectedGroup)) return;

    try {
      if (selectedUser) {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          senderId: auth.currentUser.uid,  // Replace with actual logged-in user ID
          senderName: auth.currentUser.displayName, // Assuming displayName is available
          receiverId: selectedUser.uid,
          timestamp: new Date()
        });
      } else if (selectedGroup) {
        await addDoc(collection(db, "groups", selectedGroup.id, "messages"), {
          text: newMessage,
          senderId: auth.currentUser.uid,  // Replace with actual logged-in user ID
          senderName: auth.currentUser.displayName, // Assuming displayName is available
          timestamp: new Date()
        });
      }

      setNewMessage("");  // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      await addDoc(collection(db, "groups"), {
        name: groupName,
        createdBy: auth.currentUser.uid,
        createdAt: new Date()
      });

      setGroupName("");  // Clear input field after creating group
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="left-panel">
        <UsersList onSelectUser={handleSelectUser} />
        <div className="groups-list">
          <h3>Groups</h3>
          <ul>
            {groups.map(group => (
              <li key={group.id} onClick={() => handleSelectGroup(group)}>
                {group.name}
              </li>
            ))}
          </ul>
          <form onSubmit={createGroup}>
            <input
              type="text"
              placeholder="Create new group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
      <div className="right-panel">
        {selectedUser || selectedGroup ? (
          <div className="chat-container">
            <div className="chat-header">
              <h3>Chat with {selectedUser ? selectedUser.displayName : selectedGroup.name}</h3>
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
          <h2>Select a user or group to start chatting</h2>
        )}
      </div>
    </div>
  );
};

export default Dashboard;