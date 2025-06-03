const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../../../routes/auth');
const User = require('../../../models/User');
const { createTestUser } = require('../../testUtils');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./auth.setup');

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeAll(async () => {
    await setupTestDB();
  }, 120000); // 2 minutes timeout

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  }, 30000); // 30 seconds timeout
  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);

      // Verify user was saved to database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser.username).toBe(userData.username);
    });

    it('should return 400 if user already exists', async () => {
      // Create a user first
      const existingUser = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      await new User(existingUser).save();

      // Try to create the same user again
      const response = await request(app)
        .post('/api/auth/signup')
        .send(existingUser)
        .expect('Content-Type', /json/)
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
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Username, email, and password are required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
      // Create a test user
      const userData = {
        username: 'logintest',
        email: 'login@example.com',
        password: 'password123'
      };
      
      await new User(userData).save();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify token and return user data', async () => {
      // Create a test user and get token
      const { user, token } = await createTestUser();

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user._id.toString()).toBe(user._id.toString());
      expect(response.body.user.username).toBe(user.username);
      expect(response.body.user.email).toBe(user.email);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });
  });
});