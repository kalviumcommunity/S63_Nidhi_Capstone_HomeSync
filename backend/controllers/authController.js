const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Fast validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Email format validation (frontend also validates but good security)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists - optimize query
    const existingUser = await User.findOne({ $or: [{ email }, { username }] }).select('_id');
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Signup error:', error);
    }
    res.status(500).json({ 
      message: 'Error creating user'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fast validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user by email with optimized query
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Login error:', error);
    }
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  signup,
  login
}; 