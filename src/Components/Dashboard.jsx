// src/Components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchUserResults = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const userResults = [];
        querySnapshot.forEach((doc) => {
          userResults.push({ id: doc.id, ...doc.data() });
        });

        setResults(
          userResults.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        );
        setSelectedResult(userResults[0] || null);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user results:", err);
        setLoading(false);
      }
    };

    fetchUserResults();
  }, []);




  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to LandingPage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };






  return (
    <div className="dashboard-wrapper">
      {/* 🧭 Top Nav */}
      <header className="top-navbar">
        <div className="nav-left">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>

          <Link to="/books" className="nav-link">Books</Link>
          <Link to="/therapy" className="nav-link">Therapy</Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>

      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3 className="sidebar-title">Your Sessions</h3>
          {loading ? (
            <p className="sidebar-loading">Loading...</p>
          ) : results.length === 0 ? (
            <p className="sidebar-empty">No results found.</p>
          ) : (
            <ul className="session-list">
              {results.map((res, index) => (
                <li
                  key={res.id}
                  className={`session-item ${selectedResult?.id === res.id ? "active" : ""
                    }`}
                  onClick={() => setSelectedResult(res)}
                >
                  🧠 Quiz {results.length - index} <br />
                  <small>
                    {res.createdAt?.toDate().toLocaleDateString() || "Unknown date"}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="dashboard-main">
          <h2>Hello, {auth.currentUser?.displayName || "User"} 👋</h2>
          <p className="dash-subheading">Selected Quiz Details</p>

          {selectedResult ? (
            <div className="result-details">
              <p><strong>Date:</strong> {selectedResult.createdAt?.toDate().toLocaleString()}</p>
              <p><strong>AI Insight:</strong></p>
              <div className="gpt-box">{selectedResult.gptResponse}</div>
            </div>
          ) : (
            <p>Select a quiz result from the left to view details.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
