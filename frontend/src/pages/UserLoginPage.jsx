import React from 'react';
import '../styles/theme.css';
import '../styles/auth.css';

const UserLoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">🔐 Welcome back</div>
        <h1 className="auth-title">Sign in to continue</h1>
        <p className="auth-subtitle">A calm and quick login experience for your everyday cravings.</p>

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="user-login-email">Email</label>
            <input id="user-login-email" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="user-login-password">Password</label>
            <input id="user-login-password" type="password" placeholder="Enter your password" />
          </div>

          <button className="auth-btn" type="button">Login</button>
        </form>

        <p className="auth-footer">
          New here? <a className="auth-link" href="/user/register">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default UserLoginPage;
