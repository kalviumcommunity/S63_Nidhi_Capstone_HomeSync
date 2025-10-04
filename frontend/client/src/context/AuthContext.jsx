import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Optimized token verification with caching
  const verifyToken = useCallback(async (token) => {
    try {
      const response = await api.get('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      return false;
    }
    return false;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Try to verify token in background
        await verifyToken(token);
      }
      
      setLoading(false);
      setInitializing(false);
    };

    // Don't block render - verify in background
    initializeAuth();
  }, [verifyToken]);

  const login = useCallback((userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    initializing,
    login,
    logout
  };

  // Always render children - don't block on auth verification
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 