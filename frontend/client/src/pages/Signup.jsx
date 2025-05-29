import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import GoogleSignIn from '../components/GoogleSignIn';
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    try {
      const response = await api.post('/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };

  const clearField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <div className="signup-form-container">
          <h2 className="signup-header">Sign Up:</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">
                Name:
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="form-input"
                />
                {formData.username && (
                  <button
                    type="button"
                    onClick={() => clearField('username')}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

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
                />
                {formData.email && (
                  <button
                    type="button"
                    onClick={() => clearField('email')}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password:
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="password-toggle"
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => clearField('password')}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password:
              </label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="password-toggle"
                >
                  {showConfirmPassword ? "👁" : "👁‍🗨"}
                </button>
                {formData.confirmPassword && (
                  <button
                    type="button"
                    onClick={() => clearField('confirmPassword')}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="actions-container">
              <button type="submit" className="submit-button">
                Sign Up
              </button>
              
              <div className="divider">
                <span>OR</span>
              </div>

              <GoogleSignIn />
            </div>

            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
