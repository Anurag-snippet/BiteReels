import React from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.elements.email.value; 
    const password = e.target.elements.password.value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/user/login", {
        email,
        password
      },
      {
        withCredentials: true
      });

      console.log(response.data);

      navigate("/");
      
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">🔐 Welcome back</div>
        <h1 className="auth-title">Sign in to continue</h1>
        <p className="auth-subtitle">A calm and quick login experience for your everyday cravings.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="user-login-email">Email</label>
            <input id="user-login-email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="user-login-password">Password</label>
            <input id="user-login-password" name="password" type="password" placeholder="Enter your password" />
          </div>

          <button className="auth-btn" type="submit">Login</button>
        </form>

        <p className="auth-footer">
          New here? <a className="auth-link" href="/user/register">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default UserLoginPage;
