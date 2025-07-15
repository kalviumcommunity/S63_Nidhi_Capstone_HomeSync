const express = require('express');
const { signup, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Verify token and return user data
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eec5374f63845c06b82e5b68b2830242ad47fdfe0a12dea57b4d0d661d8b6706');
    const user = await User.findById(decoded.userId || decoded.userId || decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
