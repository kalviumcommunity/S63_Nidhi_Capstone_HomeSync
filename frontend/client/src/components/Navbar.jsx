import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Show auth buttons only on homepage
  const showAuthButtons = location.pathname === '/home' || location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/">
          <img src={logo} alt="HomeSync Logo" className="logo" />
          </Link>
        </div>
        
        <div className="nav-links">
          <div className="nav-menu">
            <div className="nav-item">
              <Link to="/room-designer" className="nav-link design-nav-link">Design</Link>
            </div>
            <div className="nav-item">
              <Link to="/wishlist" className="nav-link wishlist-nav-link">Wishlist</Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link about-nav-link">About</Link>
            </div>
            <div className="nav-item">
              <Link to="/profile" className="nav-link profile-nav-link">Profile</Link>
            </div>
          </div>
        </div>

        {showAuthButtons && (
          <div className="auth-buttons">
            <Link to="/login" className="auth-button login-button">Login</Link>
            <Link to="/signup" className="auth-button signup-button">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
