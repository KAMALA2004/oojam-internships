import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import '../styles/loginStyles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log in with Supabase
    const { user, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
    } else {
      // User is authenticated, now check if they are registered
      const { data, error: registrationError } = await supabase
        .from('internship_registrations') // Check registration status in 'internship_registrations' table
        .select('*')
        .eq('email', email) // Match the user's email
        .single(); // Get the first matching result

      if (registrationError) {
        setError('Error checking registration status.');
      } else if (data) {
        // User is registered, navigate to the dashboard
        localStorage.setItem('isRegistered', 'true'); // Optional: Store registration status
        navigate('/dashboard');
      } else {
        // User is authenticated but not registered, redirect to the internship form
        navigate('/internship-form');
      }
    }
  };

  return (
    <div className="login">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;