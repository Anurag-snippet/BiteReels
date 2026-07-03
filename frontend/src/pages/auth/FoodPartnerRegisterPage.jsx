import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme.css';
import '../../styles/auth.css';
import axios from 'axios';

const FoodPartnerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    contactName: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://bitereels-backend-iuva.onrender.com/api/auth/food-partner/register", formData, {
        withCredentials: true
      });
      setMessage('Registration successful!');
      setIsError(false);
      navigate("/create-food");
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.message || 'Registration failed');
      setIsError(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back-btn" onClick={() => navigate('/')}>
          ← Back to Feed
        </button>
        <div className="auth-badge">🏪 Food partner</div>
        <h1 className="auth-title">Register your business</h1>
        <p className="auth-subtitle">Show your dishes to more customers with a simple onboarding flow.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="partner-name">Business Name</label>
            <input id="partner-name" name="name" type="text" placeholder="Blue Spice" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-email">Email</label>
            <input id="partner-email" name="email" type="email" placeholder="partner@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-password">Password</label>
            <input id="partner-password" name="password" type="password" placeholder="Create a secure password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-phone">Phone</label>
            <input id="partner-phone" name="phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-address">Address</label>
            <input id="partner-address" name="address" type="text" placeholder="123 Market Street" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label htmlFor="partner-contact">Contact Name</label>
            <input id="partner-contact" name="contactName" type="text" placeholder="Aarav Sharma" value={formData.contactName} onChange={handleChange} required />
          </div>

          {message ? <p className={isError ? 'auth-error' : 'auth-success'}>{message}</p> : null}

          <button className="auth-btn" type="submit">Register</button>
        </form>

        <p className="auth-footer">
          Already partnered with us? <a className="auth-link" href="/food-partner/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegisterPage;
