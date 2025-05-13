import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import PersonalityQuiz from './Components/PersonalityQuiz';
import LandingPage from './Components/LandingPage'
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoutes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useState, useEffect } from 'react';
import Books from './Components/Books';
import TherapyChat from './Components/TherapyChat';
// import "@fontsource/poppins";




function App() {


  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // cleanup
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />



        <Route path="/books" element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        } />



        <Route path="/quiz" element={
          <ProtectedRoute>
            <PersonalityQuiz />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />


        <Route
          path="/therapy"
          element={
            <ProtectedRoute>
              <TherapyChat />
            </ProtectedRoute>
          }
        />





      </Routes>
    </Router>
  );
}

export default App;
