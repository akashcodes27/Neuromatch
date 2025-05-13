// src/Components/Books.jsx

import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css"; // ✅ Reuse dashboard styles

const Books = () => {
  const [bookLines, setBookLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        if (results.length === 0) {
          setError("No quiz results found.");
          setLoading(false);
          return;
        }

        const latest = results.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        )[0];

        const bookText = latest.bookSuggestions || "";
        const parsedBooks = bookText
          .split("\n")
          .filter((line) => line.trim() !== "");

        setBookLines(parsedBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load book suggestions.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* 🧭 Top Nav */}
      <header className="top-navbar">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/careers" className="nav-link">Careers</Link>
        <Link to="/books" className="nav-link">Books</Link>
      </header>

      <div className="dashboard-layout">
        {/* 📚 Sidebar */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Book Insights</h3>
          <p style={{ fontSize: "14px", color: "#aaa" }}>
            Based on your most recent quiz
          </p>
        </aside>

        {/* 📘 Main Content */}
        <main className="dashboard-main">
          <h2>Hello, {auth.currentUser?.displayName || "Reader"} 📖</h2>
          <p className="dash-subheading">Books recommended for your personality:</p>

          {loading ? (
            <p>Loading suggestions...</p>
          ) : error ? (
            <p style={{ color: "#f66" }}>{error}</p>
          ) : bookLines.length === 0 ? (
            <p>No book suggestions found.</p>
          ) : (
            <div className="result-details">
              {bookLines.map((line, index) => (
                <div key={index} className="gpt-box">
                  {line}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Books;
