import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
// import logo from '../assets/logo.png'; // Use your logo path here

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setError(''); // Clear error when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = field => {
    setFormData({ ...formData, [field]: '' });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert('Login successful! Welcome back!');
      // Store the token in localStorage
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-header">Login:</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                Email:
              </label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
                {formData.email && (
                  <button
                    type="button"
                    onClick={() => handleClear('email')}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                Password:
              </label>
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => handleClear('password')}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="actions-container">
              {/* Sign in with Google */}
              <button 
                type="button"
                className="google-button"
              >
                Sign in with google
              </button>

              {/* Login Button */}
              <button
                type="submit"
                className="submit-button"
              >
                Login
              </button>

              {/* Forgot Password Link */}
              <div className="forgot-password">
                <Link to="/forgot-password">
                  Forgot your password?
                </Link>
              </div>

              {/* Signup Link */}
              <div className="signup-link">
                <span>
                  New user? <Link to="/signup">Signup</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
