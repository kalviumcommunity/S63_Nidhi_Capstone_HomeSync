const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const protect = require('../../../middleware/authMiddleware');
const User = require('../../../models/User');

// Mock the User.findById method
jest.mock('../../../models/User', () => ({
  findById: jest.fn()
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks
    User.findById.mockReset();
    
    // Setup request, response, and next function
    req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Mock jwt.verify
    jwt.verify = jest.fn();
  });

  it('should call next() if token is valid', async () => {
    // Mock successful token verification
    const mockUser = { _id: new mongoose.Types.ObjectId(), username: 'testuser' };
    jwt.verify.mockReturnValue({ id: mockUser._id });
    User.findById.mockResolvedValue(mockUser);

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(req.user).toBe(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    // Mock token verification failure
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    // No authorization header
    req.headers.authorization = undefined;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', async () => {
    // Invalid authorization format
    req.headers.authorization = 'invalid-format';

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });
});