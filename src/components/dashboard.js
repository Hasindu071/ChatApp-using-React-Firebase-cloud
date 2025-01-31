import React, { useState, useEffect } from "react";
import UsersList from "./UserList";
import UsersDropdown from "./UserListDropDown";
import { db, auth } from "./firebase"; // Correct import path
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc, where } from "firebase/firestore";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null); // selected user
  const [selectedGroup, setSelectedGroup] = useState(null); // currently selected group
  const [messages, setMessages] = useState([]); // store messages
  const [newMessage, setNewMessage] = useState(""); // text of the message being typed
  const [groupName, setGroupName] = useState(""); // group name
  const [groups, setGroups] = useState([]); // all available groups
  const [groupMembers, setGroupMembers] = useState([]); // members of the selected group

  // fetching the groups from the firebase
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
    fetchMessages(user.uid); // Fetch chat messages when user is selected
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    fetchGroupMessages(group.id); // Fetch group messages when group is selected
    fetchGroupMembers(group.id); // Fetch group members when group is selected
  };

  // fetching one-on-one messages
  const fetchMessages = (receiverId) => {
    const currentUserId = auth.currentUser.uid;
    const messagesRef = collection(db, "messages");

    const q = query(
      messagesRef,
      where("senderId", "in", [currentUserId, receiverId]),
      where("receiverId", "in", [currentUserId, receiverId]),
      orderBy("timestamp")
    );

    onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });
  };

  // fetching group messages
  const fetchGroupMessages = (groupId) => {
    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });
  };

  // fetching group members
  const fetchGroupMembers = (groupId) => {
    const membersRef = collection(db, "groups", groupId, "members");
    onSnapshot(membersRef, (snapshot) => {
      const fetchedMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroupMembers(fetchedMembers);
    });
  };

  // sending messages to the users
  const sendMessage = async () => {
    if (!newMessage.trim() || (!selectedUser && !selectedGroup)) return;

    try {
      if (selectedUser) {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          senderId: auth.currentUser.uid, // Replace with actual logged-in user ID
          senderName: auth.currentUser.displayName, // Assuming displayName is available
          receiverId: selectedUser.uid,
          timestamp: new Date()
        });
      } else if (selectedGroup) {
        await addDoc(collection(db, "groups", selectedGroup.id, "messages"), {
          text: newMessage,
          senderId: auth.currentUser.uid, // Replace with actual logged-in user ID
          senderName: auth.currentUser.displayName, // Assuming displayName is available
          timestamp: new Date()
        });
      }

      setNewMessage(""); // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // create a new group
  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      await addDoc(collection(db, "groups"), {
        name: groupName,
        createdBy: auth.currentUser.uid,
        createdAt: new Date()
      });

      setGroupName(""); // Clear input field after creating group
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // add a new member to the group
  const addGroupMember = async (user) => {
    if (!selectedGroup) return;

    try {
      await setDoc(doc(db, "groups", selectedGroup.id, "members", user.uid), {
        userId: user.uid,
        addedAt: new Date(),
        displayName: user.displayName
      });

      // Clear input field after adding member
    } catch (error) {
      console.error("Error adding group member:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="left-panel">
        <UsersList onSelectUser={handleSelectUser} />
        <div>
          <h3>Groups</h3>
          <ul className="userlist">
            {groups.map(group => (
              <li classname="userlist-item" key={group.id} onClick={() => handleSelectGroup(group)}>
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
            <button type="submit" class="db-button">Create</button>
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
              {messages.map((message) => {
                let messageClass = "message received"; // Default class (received messages)

                // Check if the message was sent by the logged-in user
                if (message.senderId === auth.currentUser.uid) {
                  messageClass = "message sent"; // Apply 'sent' class for user's own messages
                }

                return (
                  <div key={message.id} className={messageClass}>
                    <p style={{ fontSize: "11px", color: "rgba(6, 54, 56)" }}><strong>{message.senderName}</strong></p>
                    <p>{message.text}</p>
                    <p className="time-style">
                      <span>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</span>
                    </p>
                  </div>
                );
              })}
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
            {selectedGroup && (
              <div>
                <UsersDropdown onSelectUser={addGroupMember} groupMembers={groupMembers} />
                <ul>
                {groupMembers.map((member, index) => (
                  <span style={{ color: "black", marginLeft: "15px", fontSize : "13px", marginTop:"2px"}}key={member.id}>
                    {member.displayName}
                    {index < groupMembers.length - 1 && ","}
                  </span>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="select">Select a user or group to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;