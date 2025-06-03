import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll just show a message
      alert('Google Sign In functionality would be implemented here');
      
      // Normally, this would be the OAuth flow:
      // window.location.href = 'http://localhost:5000/api/auth/google';
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <button 
      onClick={handleGoogleSignIn}
      className="google-signin-button"
      type="button"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
        alt="Google logo" 
        className="google-icon" 
      />
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;