import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setEmail(e.target.value);
  };

  const handleClear = () => {
    setEmail('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form-wrapper">
        <div className="forgot-password-form-container">
          <h2 className="forgot-password-header">Forgot Password</h2>
          
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label className="form-label">
                Email:
              </label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
                {email && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <div className="actions-container">
              <button
                type="submit"
                className="submit-button"
              >
                Send Reset Link
              </button>

              <div className="back-to-login">
                <Link to="/login">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
