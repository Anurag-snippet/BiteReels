import React from 'react';
import '../styles/theme.css';
import '../styles/auth.css';

const FoodPartnerLoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">📦 Partner access</div>
        <h1 className="auth-title">Welcome back, partner</h1>
        <p className="auth-subtitle">Manage your menu and orders with a streamlined sign-in experience.</p>

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="partner-login-email">Email</label>
            <input id="partner-login-email" type="email" placeholder="partner@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-login-password">Password</label>
            <input id="partner-login-password" type="password" placeholder="Enter your password" />
          </div>

          <button className="auth-btn" type="button">Login</button>
        </form>

        <p className="auth-footer">
          New partner? <a className="auth-link" href="/food-partner/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLoginPage;
