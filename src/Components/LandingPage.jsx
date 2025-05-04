// LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="landing-header">
        <h1>Welcome to NeuroMatch</h1>
        <p>AI-Powered Personality Insight & Career Recommendations</p>
        <button onClick={() => navigate("/signup")}>Get Started</button>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🎯 Personalized Guidance</h3>
          <p>Receive tailored suggestions based on how you think, feel, and respond.</p>
        </div>
        <div className="feature-card">
          <h3>🧠 GPT-Driven Intelligence</h3>
          <p>Leverage advanced AI to gain actionable advice aligned with your personality.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Quiz & Analysis</h3>
          <p>Take a 20-question quiz and discover hidden strengths and potential career paths.</p>
        </div>
        <div className="feature-card">
          <h3>🔐 Private & Secure</h3>
          <p>Your data is securely handled and stored with industry best practices.</p>
        </div>
      </div>
    </div>
  );
};


export default LandingPage;