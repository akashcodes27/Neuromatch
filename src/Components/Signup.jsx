import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // ✅ your auth instance


const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    // ✅ Step 1: Register user using Firebase Auth
    const userCred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    // ✅ Step 2: Optionally update the user's display name
    await updateProfile(userCred.user, {
      displayName: form.name
    });

    // ✅ Step 3: Save UID to localStorage (or use context/auth state)
    localStorage.setItem("token", userCred.user.uid);

    // ✅ Step 4: Redirect to quiz
    navigate("/quiz");
  } catch (err) {
    console.error("Signup Error:", err.message);
    setError(err.message);
  }
};


  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Create Account</button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
