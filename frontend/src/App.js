// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ResumeEvaluator from "./ResumeEvaluator";
import HRDashboard from "./HRDashboard";
import Chatbot from "./Chatbot";
import Signup from "./Signup";
import Login from "./Login";

const App = () => {
  return (
    <Router>
      <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white", textAlign: "center", padding: "20px" }}>
        <h1>🚀 AI Resume Evaluator</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={linkStyle}>Home</Link> |{" "}
          <Link to="/chatbot" style={linkStyle}>Chatbot</Link> |{" "}
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link> |{" "}
          <Link to="/login" style={linkStyle}>Login</Link> |{" "}
          <Link to="/signup" style={linkStyle}>Signup</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ResumeEvaluator />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/dashboard" element={<HRDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

const linkStyle = {
  color: "#61dafb",
  textDecoration: "none",
  margin: "0 10px",
};

export default App;


















