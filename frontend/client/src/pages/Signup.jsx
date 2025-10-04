import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
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
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setError(''); // Clear errors when user types
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const newValidationErrors = { ...validationErrors };
    
    if (name === 'username') {
      if (value.length < 3) {
        newValidationErrors.username = 'Username must be at least 3 characters';
      } else {
        delete newValidationErrors.username;
      }
    }
    
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
      
      // Also check confirm password if it exists
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newValidationErrors.confirmPassword = 'Passwords do not match';
      } else if (formData.confirmPassword) {
        delete newValidationErrors.confirmPassword;
      }
    }
    
    if (name === 'confirmPassword') {
      if (value && value !== formData.password) {
        newValidationErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newValidationErrors.confirmPassword;
      }
    }
    
    setValidationErrors(newValidationErrors);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const isValidForm = () => {
    return formData.username && formData.email && formData.password && 
           formData.password === formData.confirmPassword &&
           Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
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
      const response = await api.post('/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/room-designer');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // const clearField = (fieldName) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [fieldName]: ''
  //   }));
  // };

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
                  className={`form-input ${validationErrors.username ? 'error' : ''}`}
                  disabled={loading}
                />
              </div>
              {validationErrors.username && (
                <div className="validation-error">{validationErrors.username}</div>
              )}
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
                  className={`form-input ${validationErrors.email ? 'error' : ''}`}
                  disabled={loading}
                />
              </div>
              {validationErrors.email && (
                <div className="validation-error">{validationErrors.email}</div>
              )}
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
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {validationErrors.password && (
                <div className="validation-error">{validationErrors.password}</div>
              )}
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
                  placeholder="Confirm your password"
                  className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showConfirmPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <div className="validation-error">{validationErrors.confirmPassword}</div>
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
                    Creating account...
                  </>
                ) : 'Sign Up'}
              </button>
              
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
