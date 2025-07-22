// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Dashboard.css";

function Dashboard() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "resume_history"));
      const entries = querySnapshot.docs.map((doc) => doc.data());
      setHistory(entries.reverse());
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Upload History Dashboard</h2>

      <div className="upload-history">
        {history.length === 0 ? (
          <p>No uploads yet.</p>
        ) : (
          <>
            <h3>Recent Uploads:</h3>
            <ul>
              {history.map((item, i) => (
                <li key={i}>
                  {item.mode} | Score: {item.score}
                  {item.similarity && ` | JD Match: ${item.similarity}%`} |{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
