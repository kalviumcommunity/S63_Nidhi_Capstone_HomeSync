const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Create a test user and generate a valid JWT token
 * @param {Object} userData - Optional user data to override defaults
 * @returns {Object} Object containing user document and token
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };

  const userToCreate = { ...defaultUser, ...userData };
  const user = new User(userToCreate);
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user, token };
};

/**
 * Generate authorization header with Bearer token
 * @param {string} token - JWT token
 * @returns {Object} Headers object with Authorization
 */
const authHeader = (token) => ({
  Authorization: `Bearer ${token}`
});

module.exports = {
  createTestUser,
  authHeader
};