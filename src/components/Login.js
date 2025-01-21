import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import '../styles/loginStyles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const { user, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
    } else {
      
      const { data, error: registrationError } = await supabase
        .from('internship_registrations') 
        .select('*')
        .eq('email', email) 
        .single(); 

      if (registrationError) {
        setError('Error checking registration status.');
      } else if (data) {
        
        localStorage.setItem('isRegistered', 'true'); 
        navigate('/dashboard');
      } else {
        
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