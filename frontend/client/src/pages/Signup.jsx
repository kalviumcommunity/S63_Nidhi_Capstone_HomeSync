import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      alert('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
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
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">
                Name:
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="form-input"
                />
                {formData.name && (
                  <button
                    type="button"
                    onClick={() => clearField('name')}
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
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                />
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
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                />
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
              <button 
                type="button"
                className="google-button"
              >
                Sign up with google
              </button>

              <button
                type="submit"
                className="submit-button"
              >
                Sign in
              </button>

              <div className="login-link">
                <span>
                  Already a user? <Link to="/login">Login</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
