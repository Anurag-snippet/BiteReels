import React from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegisterPage = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.elements.fullName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      const response = await axios.post("https://bitereels-backend-iuva.onrender.com/api/auth/user/register", {
        fullName,
        email,
        password
      },
      {
        withCredentials: true
      });
      navigate("/");
      
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
        <div className="auth-badge">🍽️ User account</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join with a simple sign-up and start exploring your next favorite meal.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="user-name">Full name</label>
            <input id="user-name" name="fullName" type="text" placeholder="Ava Carter" />
          </div>

          <div className="auth-field">
            <label htmlFor="user-email">Email</label>
            <input id="user-email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label htmlFor="user-password">Password</label>
            <input id="user-password" name="password" type="password" placeholder="At least 8 characters" />
          </div>

          <button className="auth-btn" type="submit">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a className="auth-link" href="/user/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default UserRegisterPage;
