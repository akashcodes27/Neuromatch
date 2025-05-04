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
      </Routes>
    </Router>
  );
}

export default App;
