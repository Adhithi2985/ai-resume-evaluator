// Chatbot.jsx
import React, { useState } from "react";
import "./Chatbot.css";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hi! I’m your resume assistant. Ask me anything!", type: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat/", {
        message: input,
      });
      const botMessage = {
        text: res.data.reply || "Sorry, I didn’t get that.",
        type: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "❌ Server error. Try again later.", type: "bot" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      <h2>💬 Resume Chatbot</h2>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask about resumes, skills, JDs..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;



