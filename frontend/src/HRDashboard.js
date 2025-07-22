// File: src/HRDashboard.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./HRDashboard.css";

const HRDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [searchSkill, setSearchSkill] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeRef = collection(db, "resumes");
        const snapshot = await getDocs(resumeRef);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResumes(docs);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchData();
  }, []);

  const filteredResumes = resumes.filter((resume) => {
    const skills = Array.isArray(resume.skills)
      ? resume.skills.join(" ").toLowerCase()
      : "";
    return skills.includes(searchSkill.toLowerCase());
  });

  return (
    <div className="dashboard">
      <h2>📋 HR Resume Dashboard</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by skill (e.g., Python, React)"
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
        />
      </div>

      {filteredResumes.length === 0 ? (
        <p>No matching resumes found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Uploaded</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredResumes.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.name}</td>
                <td>{resume.email}</td>
                <td>{resume.phone}</td>
                <td>{Array.isArray(resume.skills) ? resume.skills.join(", ") : "N/A"}</td>
                <td>
                  {resume.uploadedAt?.seconds
                    ? new Date(resume.uploadedAt.seconds * 1000).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor:
                        resume.score >= 8
                          ? "#4caf50"
                          : resume.score >= 5
                          ? "#ffc107"
                          : "#f44336",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {resume.score ?? "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HRDashboard;


