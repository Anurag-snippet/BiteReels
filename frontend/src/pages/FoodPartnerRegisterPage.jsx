import React from 'react';
import '../styles/theme.css';
import '../styles/auth.css';

const FoodPartnerRegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">🏪 Food partner</div>
        <h1 className="auth-title">Register your kitchen</h1>
        <p className="auth-subtitle">Show your dishes to more customers with a refined and simple onboarding flow.</p>

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="partner-name">Restaurant name</label>
            <input id="partner-name" type="text" placeholder="Blue Spice" />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-email">Email</label>
            <input id="partner-email" type="email" placeholder="partner@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-password">Password</label>
            <input id="partner-password" type="password" placeholder="Create a secure password" />
          </div>

          <button className="auth-btn" type="button">Register</button>
        </form>

        <p className="auth-footer">
          Already partnered with us? <a className="auth-link" href="/food-partner/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegisterPage;
