import React from 'react';
import '../styles/theme.css';
import '../styles/auth.css';

const UserRegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">🍽️ User account</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join with a simple sign-up and start exploring your next favorite meal.</p>

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="user-name">Full name</label>
            <input id="user-name" type="text" placeholder="Ava Carter" />
          </div>

          <div className="auth-field">
            <label htmlFor="user-email">Email</label>
            <input id="user-email" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="user-password">Password</label>
            <input id="user-password" type="password" placeholder="At least 8 characters" />
          </div>

          <button className="auth-btn" type="button">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a className="auth-link" href="/user/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default UserRegisterPage;
