import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function AdminDashboard() {
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resumesSnapshot = await getDocs(collection(db, "resumes"));
      const matchSnapshot = await getDocs(collection(db, "matches"));

      const resumeData = resumesSnapshot.docs.map(doc => doc.data());
      const matchData = matchSnapshot.docs.map(doc => doc.data());

      setResumes(resumeData);
      setMatches(matchData);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>📊 Admin Dashboard</h1>

      <h2>📄 Uploaded Resumes</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Skills</th><th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((res, i) => (
            <tr key={i}>
              <td>{res.name}</td>
              <td>{res.email}</td>
              <td>{res.phone}</td>
              <td>{res.skills?.join(", ")}</td>
              <td>{new Date(res.uploaded_at?.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>🧠 Match Scores</h2>
      <table>
        <thead>
          <tr>
            <th>Match Score (%)</th><th>Matched At</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, i) => (
            <tr key={i}>
              <td>{match.match_score}</td>
              <td>{new Date(match.matched_at?.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
