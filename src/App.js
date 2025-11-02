import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import InternshipForm from "./components/InternshipForm";
import Dashboard from "./components/Dashboard"; 

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/internship-form" /> : <Login setUser={setUser} />}
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/internship-form" /> : <SignUp />}
        />
        <Route 
          path="/internship-form" 
          element={user ? <InternshipForm /> : <Navigate to="/login" />}
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
