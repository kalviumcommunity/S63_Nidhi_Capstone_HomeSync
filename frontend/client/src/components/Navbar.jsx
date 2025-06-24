import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, User, LogOut } from 'lucide-react';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { wishlist = [] } = useWishlist() || {};

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/home">
            <img src={logo} alt="HomeSync Logo" className="logo" />
          </Link>
        </div>
        
        <div className="nav-links">
          <div className="nav-menu">
            <div className="nav-item">
              <Link to="/room-designer" className="nav-link">Design</Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </div>
            {user && (
              <div className="nav-item">
                <Link to="/wishlist" className="nav-link wishlist-link">
                  <Heart size={18} />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="wishlist-count">{wishlist.length}</span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <Link to="/room-designer" className="user-button">
                <User size={18} />
                {user.username}
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-button login-button">Login</Link>
              <Link to="/signup" className="auth-button signup-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
