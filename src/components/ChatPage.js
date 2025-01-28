import React, { useState, useEffect } from "react";
import { db } from "./firebase/firebase"; // Import Firebase Firestore instance
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const ChatPage = ({ user }) => {
  const [message, setMessage] = useState(""); // State to handle the current message input
  const [messages, setMessages] = useState([]); // State to store the chat messages

  const messagesRef = collection(db, "messages"); // Reference to the "messages" collection in Firestore

  useEffect(() => {
    // Real-time listener for Firestore messages
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [messagesRef]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await addDoc(messagesRef, {
          text: message,
          sender: user.email,
          timestamp: new Date(),
        });
        setMessage(""); // Clear the input field after sending
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-blue-600 text-white text-lg font-semibold shadow">
        Welcome to the Chat App, {user.email}!
      </header>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.sender === user.email
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300"
                } w-max max-w-xs`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-200">
                  {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t flex items-center space-x-2"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
