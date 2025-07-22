import React, { useState } from "react";
import axios from "axios";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./ResumeEvaluator.css";


function ResumeEvaluator() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [text, setText] = useState("");
  const [score, setScore] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [mode, setMode] = useState("Candidate");

  const handleUpload = async () => {
    if (!resumeFile) {
      alert("Please select a PDF resume file.");
      return;
    }
    if (mode === "HR" && !jdFile) {
      alert("Please upload a job description PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("mode", mode);
    if (jdFile) formData.append("jd", jdFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.error) {
        alert("Error: " + res.data.error);
      } else {
        setText(res.data.text || "");
        setScore(res.data.score);
        setSimilarity(res.data.similarity || null);
        setSuggestions(res.data.suggestions || "");

        await addDoc(collection(db, "resume_history"), {
          mode,
          score: res.data.score,
          similarity: res.data.similarity || null,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload or extract resume.");
    }
  };

  return (
    <div className="resume-evaluator-container">
      <h2>📄 AI Resume Evaluator</h2>

      <div className="mode-toggle">
        <label>Mode:&nbsp;</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="Candidate">Candidate</option>
          <option value="HR">HR / Recruiter</option>
        </select>
      </div>

      {mode === "HR" && (
        <div className="input-group">
          <label>Upload Job Description (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setJdFile(e.target.files[0])}
          />
        </div>
      )}

      <div className="input-group">
        <label>Upload Resume (PDF):</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />
      </div>

      <button onClick={handleUpload}>Upload & Evaluate</button>

      {score !== null && (
        <div className="results">
          <h3>✅ Resume Score: {score}/10</h3>

          {mode === "HR" && similarity !== null && (
            <h4>🔍 JD Match Score: {similarity}%</h4>
          )}

          {mode === "Candidate" && suggestions && (
            <>
              <h4>💡 Suggestions to Improve Resume:</h4>
              <pre>{suggestions}</pre>
            </>
          )}

          <h4>📄 Extracted Resume Text:</h4>
          <pre>{text}</pre>
        </div>
      )}
    </div>
  );
}

export default ResumeEvaluator;


      