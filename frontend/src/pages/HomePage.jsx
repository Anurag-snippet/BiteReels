import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/theme.css';
import '../styles/auth.css';

const HomePage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">✨ Choose your path</div>
        <h1 className="auth-title">Welcome to Zomato Clone</h1>
        <p className="auth-subtitle">Pick the experience that fits you best and continue with a simple, clean sign-up flow.</p>

        <div className="auth-form">
          <Link to="/user/register" className="auth-btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Register as User
          </Link>
          <Link to="/food-partner/register" className="auth-btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Register as Food Partner
          </Link>
        </div>

        <p className="auth-footer">
          Already have an account? <Link className="auth-link" to="/user/login">User login</Link> or{' '}
          <Link className="auth-link" to="/food-partner/login">Partner login</Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
