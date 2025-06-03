const { signup, login } = require('../../../controllers/authController');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

// Mock User model and jwt
jest.mock('../../../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Set environment variable
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('signup', () => {
    it('should create a new user and return token', async () => {
      // Mock request body
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return null (no existing user)
      User.findOne.mockResolvedValue(null);
      
      // Mock User constructor and save method
      const mockUser = {
        _id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);
      
      // Mock jwt.sign
      jwt.sign.mockReturnValue('mock-token');
      
      await signup(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ 
        $or: [{ email: 'test@example.com' }, { username: 'testuser' }] 
      });
      expect(mockUser.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User created successfully',
        token: 'mock-token',
        user: expect.objectContaining({
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email
        })
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      // Missing fields
      req.body = {
        username: 'testuser'
        // Missing email and password
      };
      
      await signup(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username, email, and password are required'
      });
    });

    it('should return 400 if user already exists', async () => {
      req.body = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return an existing user
      User.findOne.mockResolvedValue({ 
        _id: 'existing-id', 
        username: 'existinguser' 
      });
      
      await signup(req, res);
      
      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists'
      });
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock user with comparePassword method
      const mockUser = {
        _id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      // Mock User.findOne
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock jwt.sign
      jwt.sign.mockReturnValue('mock-token');
      
      await login(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login successful',
        token: 'mock-token',
        user: expect.objectContaining({
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email
        })
      }));
    });

    it('should return 401 if user not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return null (user not found)
      User.findOne.mockResolvedValue(null);
      
      await login(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      // Mock user with comparePassword method that returns false
      const mockUser = {
        _id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      
      // Mock User.findOne
      User.findOne.mockResolvedValue(mockUser);
      
      await login(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });
});