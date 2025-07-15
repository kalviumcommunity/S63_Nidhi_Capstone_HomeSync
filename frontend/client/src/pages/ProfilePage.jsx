import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div className="profile-page-bg">
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-card">
          <img src={user.profileImage || '/assets/placeholder.png'} alt={user.name || user.username} className="profile-avatar" />
          <div className="profile-info">
            <div className="profile-row">
              <span className="profile-label">Name:</span>
              <span className="profile-value">{user.name || user.username}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{user.email}</span>
            </div>
          </div>
        </div>
        <button className="profile-logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  );
};

export default ProfilePage; 