import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/Login.css';
// import logo from '../assets/logo.png'; // Use your logo path here

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    setError(''); // Clear errors when user types
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const newValidationErrors = { ...validationErrors };
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        newValidationErrors.email = 'Please enter a valid email address';
      } else {
        delete newValidationErrors.email;
      }
    }
    
    if (name === 'password') {
      if (value.length < 6) {
        newValidationErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newValidationErrors.password;
      }
    }
    
    setValidationErrors(newValidationErrors);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidForm = () => {
    return formData.email && formData.password && 
           Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidForm()) {
      setError('Please fix validation errors');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);
      // Use the login function from AuthContext
      login(response.data.user, response.data.token);
      // Navigate to room-designer instead of dashboard
      navigate('/room-designer');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
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
                  className={`form-input ${validationErrors.email ? 'error' : ''}`}
                  required
                  disabled={loading}
                />
              </div>
              {validationErrors.email && (
                <div className="validation-error">{validationErrors.email}</div>
              )}
            </div>

            {/* Password Field */}
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
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {validationErrors.password && (
                <div className="validation-error">{validationErrors.password}</div>
              )}
            </div>

            <div className="actions-container">
              <button
                type="submit"
                className="submit-button"
                disabled={loading || !isValidForm()}
              >
                {loading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #ffffff', 
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      display: 'inline-block',
                      marginRight: '8px'
                    }}></div>
                    Logging in...
                  </>
                ) : 'Login'}
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
