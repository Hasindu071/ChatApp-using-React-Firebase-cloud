import { useEffect, useState, useRef } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, onSnapshot, serverTimestamp, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/chatPage.css"; // Ensure you create this CSS file for styling

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // For auto-scrolling

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/signin");
      return;
    }

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [navigate]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: message,
      timestamp: serverTimestamp(),
      user: auth.currentUser.email,
    });

    setMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.user === auth.currentUser.email ? "message sent" : "message received"}>
            <p><strong>{msg.user}: </strong>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message..." 
          className="chat-input"
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
};

export default Chat;
