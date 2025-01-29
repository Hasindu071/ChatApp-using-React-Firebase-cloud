import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, onSnapshot, serverTimestamp, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/signin"); // Redirect to login if not authenticated
      return;
    }

    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}><strong>{msg.user}: </strong>{msg.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
