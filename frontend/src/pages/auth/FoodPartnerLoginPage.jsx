import React from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerLoginPage = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
        email,
        password
      },
      {
        withCredentials: true
      });
      navigate("/create-food");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back-btn" onClick={() => navigate('/')}>
          ← Back to Feed
        </button>
        <div className="auth-badge">📦 Partner access</div>
        <h1 className="auth-title">Welcome back, partner</h1>
        <p className="auth-subtitle">Manage your menu and orders with a streamlined sign-in experience.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="partner-login-email">Email</label>
            <input id="partner-login-email" name="email" type="email" placeholder="partner@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-login-password">Password</label>
            <input id="partner-login-password" name="password" type="password" placeholder="Enter your password" />
          </div>

          <button className="auth-btn" type="submit">Login</button>
        </form>

        <p className="auth-footer">
          New partner? <a className="auth-link" href="/food-partner/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLoginPage;
