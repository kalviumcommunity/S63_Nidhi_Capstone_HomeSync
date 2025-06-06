import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) return;

    // Initialize socket connection with auth token
    const socketInstance = io('http://localhost:5001', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnected(false);
    });

    // Handle notifications
    socketInstance.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      // You could also play a sound or show a toast notification here
    });

    // Set socket instance
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  // Function to clear a notification
  const clearNotification = (notificationId) => {
    setNotifications((prev) => 
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Function to emit wishlist updates
  const emitWishlistUpdate = (action, item) => {
    if (socket && connected) {
      socket.emit('wishlist:update', { action, item });
    }
  };

  // Function to emit room interactions (likes, comments)
  const emitRoomInteraction = (type, roomId, ownerId, message = '') => {
    if (socket && connected) {
      socket.emit('room:interaction', { type, roomId, ownerId, message });
    }
  };

  // Function to emit chat messages (for future implementation)
  const emitChatMessage = (recipientId, message) => {
    if (socket && connected) {
      socket.emit('chat:message', { recipientId, message });
    }
  };

  const value = {
    socket,
    connected,
    notifications,
    clearNotification,
    clearAllNotifications,
    emitWishlistUpdate,
    emitRoomInteraction,
    emitChatMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};