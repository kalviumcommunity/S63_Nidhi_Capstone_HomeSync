import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Login.css';
// import logo from '../assets/logo.png'; // Use your logo path here

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    setError(''); // Clear error when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = field => {
    setFormData({ ...formData, [field]: '' });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await api.post('/api/auth/login', formData);
      // Use the login function from AuthContext
      login(response.data.user, response.data.token);
      // Navigate to room-designer instead of dashboard
      navigate('/room-designer');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="actions-container">
              <button
                type="submit"
                className="submit-button"
              >
                Login
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <GoogleSignIn />

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
