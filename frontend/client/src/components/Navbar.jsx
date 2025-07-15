import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, User, LogOut } from 'lucide-react';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <img src={logo} alt="HomeSync Logo" className="logo" />
        </div>
        
        <div className="nav-links">
          <div className="nav-menu">
            <div className="nav-item">
              <Link to="/room-designer" className="nav-link design-nav-link">Design</Link>
            </div>
            <div className="nav-item">
              <Link to="/wishlist" className="nav-link wishlist-nav-link">
                <Heart size={20} className="inline mr-1" />
                Wishlist
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link about-nav-link">About</Link>
            </div>
            <div className="nav-item">
              <Link to="/profile" className={`nav-link${location.pathname === '/profile' ? ' active' : ''} profile-link`}>
                <span role="img" aria-label="profile" className="nav-icon">👤</span> Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="auth-button login-button">Login</Link>
          <Link to="/signup" className="auth-button signup-button">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
