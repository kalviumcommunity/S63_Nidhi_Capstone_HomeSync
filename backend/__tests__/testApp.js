const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

/**
 * Creates a test Express app with common middleware
 * @returns {Object} Express app instance
 */
const createTestApp = () => {
  const app = express();
  
  // Common middleware
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  }));
  
  app.use(express.json());
  app.use(cookieParser());
  
  return app;
};

module.exports = createTestApp;