import React, { useState, useEffect, useCallback } from "react";
import UsersList from "./UserList";
import UsersDropdown from "./UserListDropDown";
import { db, auth } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc, where, getDocs } from "firebase/firestore";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null); // selected user
  const [selectedGroup, setSelectedGroup] = useState(null); // currently selected group
  const [messages, setMessages] = useState([]); // store messages
  const [newMessage, setNewMessage] = useState(""); // text of the message being typed
  const [groupName, setGroupName] = useState(""); // group name
  const [groups, setGroups] = useState([]); // all available groups
  const [groupMembers, setGroupMembers] = useState([]); // members of the selected group

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const currentUserId = currentUser.uid;
      const groupsRef = collection(db, "groups");

      // Query all groups
      const q = query(groupsRef);

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchedGroups = [];

        // For each group, check the members subcollection
        for (const groupDoc of snapshot.docs) {
          const groupId = groupDoc.id;

          // Reference to the members subcollection of this group
          const membersRef = collection(db, "groups", groupId, "members");

          // Get the documents from the members subcollection
          const memberSnapshot = await getDocs(membersRef);

          // Check if currentUserId is present in the memberSnapshot
          const userIsMember = memberSnapshot.docs.some(doc => doc.data().userId === currentUserId);

          if (userIsMember) {
            fetchedGroups.push({ id: groupId, ...groupDoc.data() });
          }
        }

        setGroups(fetchedGroups);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    fetchMessages(user.uid); // Fetch chat messages when user is selected
  }, []);

  const handleSelectGroup = useCallback((group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    fetchGroupMessages(group.id); // Fetch group messages when group is selected
    fetchGroupMembers(group.id); // Fetch group members when group is selected
  }, []);

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

  const fetchGroupMessages = (groupId) => {
    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });
  };

  const fetchGroupMembers = (groupId) => {
    const membersRef = collection(db, "groups", groupId, "members");
    onSnapshot(membersRef, (snapshot) => {
      const fetchedMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroupMembers(fetchedMembers);
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || (!selectedUser && !selectedGroup)) return;

    try {
      const messageData = {
        text: newMessage,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        timestamp: new Date(),
      };

      if (selectedUser) {
        await addDoc(collection(db, "messages"), {
          ...messageData,
          receiverId: selectedUser.uid
        });
      } else if (selectedGroup) {
        await addDoc(collection(db, "groups", selectedGroup.id, "messages"), messageData);
      }

      setNewMessage(""); // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const groupRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });

      await setDoc(doc(db, "groups", groupRef.id, "members", auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        addedAt: new Date(),
        displayName: auth.currentUser.displayName,
      });

      setGroupName(""); // Clear input field after creating group

      setGroups((prevGroups) => [...prevGroups, { id: groupRef.id, name: groupName }]);
    } catch (error) {
      console.error("Error creating group or adding member:", error);
    }
  };

  const addGroupMember = async (user) => {
    if (!selectedGroup) return;

    try {
      await setDoc(doc(db, "groups", selectedGroup.id, "members", user.uid), {
        userId: user.uid,
        addedAt: new Date(),
        displayName: user.displayName,
      });
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
              <li className="userlist-item" key={group.id} onClick={() => handleSelectGroup(group)}>
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
            <button type="submit" className="db-button">Create</button>
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
                const messageClass = message.senderId === auth.currentUser.uid ? "message sent" : "message received";

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
                    <span style={{ color: "black", marginLeft: "15px", fontSize: "13px", marginTop: "2px" }} key={member.id}>
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
