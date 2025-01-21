import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import InternshipForm from "./components/InternshipForm";
import Dashboard from "./components/Dashboard";  
import { supabase } from "./supabaseClient";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
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
