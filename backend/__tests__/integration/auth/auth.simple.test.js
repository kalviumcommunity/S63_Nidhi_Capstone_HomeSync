const request = require('supertest');
const express = require('express');
const authRoutes = require('../../../routes/auth');

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Mock the User model
jest.mock('../../../models/User', () => {
  const mockUser = {
    _id: 'mockUserId123',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2a$10$hashedPassword', // Mock hashed password
    save: jest.fn().mockResolvedValue(true),
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  const UserMock = jest.fn().mockImplementation((userData) => ({
    ...mockUser,
    ...userData,
    save: jest.fn().mockResolvedValue(true),
    comparePassword: jest.fn().mockResolvedValue(true),
  }));

  UserMock.findOne = jest.fn();
  UserMock.findById = jest.fn();

  return UserMock;
});

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes - Simple Tests', () => {
  const User = require('../../../models/User');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      // Mock that user doesn't exist
      User.findOne.mockResolvedValue(null);

      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(User.findOne).toHaveBeenCalledWith({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
      });
    });

    it('should return 400 if user already exists', async () => {
      // Mock that user exists
      User.findOne.mockResolvedValue({
        _id: 'existingUserId',
        username: 'existinguser',
        email: 'existing@example.com'
      });

      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUser = {
        username: 'incomplete'
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Username, email, and password are required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
      // Mock user exists and password matches
      const mockUser = {
        _id: 'userId123',
        username: 'logintest',
        email: 'login@example.com',
        password: '$2a$10$hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(mockUser.username);
      expect(response.body.user.email).toBe(mockUser.email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    });

    it('should return 401 for invalid credentials', async () => {
      // Mock user not found
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
      // Mock user exists but password doesn't match
      const mockUser = {
        _id: 'userId123',
        username: 'logintest',
        email: 'login@example.com',
        password: '$2a$10$hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify token and return user data', async () => {
      const mockUser = {
        _id: 'userId123',
        username: 'testuser',
        email: 'test@example.com'
      };

      // Mock the findById method to return an object with select method
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Create a valid token for testing
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: mockUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user._id).toBe(mockUser._id);
      expect(response.body.user.username).toBe(mockUser.username);
      expect(response.body.user.email).toBe(mockUser.email);
      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });
  });
});