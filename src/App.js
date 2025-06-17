import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import InternshipForm from "./components/InternshipForm";
import Dashboard from "./components/Dashboard"; 
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const checkUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/check-session", {
        withCredentials: true,
      });
      setUser(res.data.user || null);
    } catch (error) {
      setUser(null);
    }
  };
  checkUser();
}, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/internship-form" element={<InternshipForm />} />
        
        
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Login setUser={setUser} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
