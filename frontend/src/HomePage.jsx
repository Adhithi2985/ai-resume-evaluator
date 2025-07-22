import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleNavigation = () => {
    if (role === "HR") {
      navigate("/dashboard");
    } else if (role === "Candidate") {
      navigate("/resume-evaluator");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to AI Resume Evaluator</h1>
      <button onClick={handleNavigation}>Continue</button>
    </div>
  );
};

export default HomePage;
