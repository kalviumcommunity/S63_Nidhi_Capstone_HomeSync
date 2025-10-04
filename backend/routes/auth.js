const express = require('express');
const { signup, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Verify token and return user data - optimized
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optimized query - only get necessary fields
    const user = await User.findById(decoded.userId)
      .select('_id username email createdAt lastLogin')
      .lean(); // Use lean() for faster JSON serialization
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    // Simplified error message for security
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
