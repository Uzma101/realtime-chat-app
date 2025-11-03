import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io.connect("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && name.trim()) {
      const data = {
        name,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="name-input"
      />

      <div className="chat-box">
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.name}</strong> [{msg.time}]: {msg.message}
          </p>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
