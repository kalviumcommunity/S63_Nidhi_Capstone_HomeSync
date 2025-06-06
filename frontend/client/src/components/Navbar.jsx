import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, logout } = useAuth();

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
              <Link to="/explore" className="nav-link">Explore</Link>
            </div>
            <div className="nav-item">
              <Link to="/editor" className="nav-link">Design</Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </div>
            {user && (
              <div className="nav-item">
                <Link to="/wishlist" className="nav-link">Wishlist</Link>
              </div>
            )}
          </div>
        </div>

        {user ? (
          <div className="user-menu">
            <NotificationCenter />
            <div className="user-profile">
              <Link to="/dashboard" className="profile-link">
                <img 
                  src={user.profileImage || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="profile-image"
                />
              </Link>
              <div className="dropdown-menu">
                <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                <button onClick={logout} className="dropdown-item logout-button">Logout</button>
              </div>
            </div>
          </div>
        ) : (
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
