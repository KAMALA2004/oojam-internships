import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
  return (
    <header className="header">
      <h1>Welcome to Our App</h1>
      <nav>
        {!user ? (
          <div>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        ) : (
          <div>
            <span>Logged in as: {user.email}</span>
            
            <Link to="/internship-form" className="nav-link">
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
