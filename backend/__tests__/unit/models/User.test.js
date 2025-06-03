const mongoose = require('mongoose');
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('User validation', () => {
    it('should validate a valid user', async () => {
      const validUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const savedUser = await validUser.save();
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe('testuser');
      expect(savedUser.email).toBe('test@example.com');
    });

    it('should require username, email, and password', async () => {
      const userWithoutRequired = new User({});
      
      let error;
      try {
        await userWithoutRequired.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should not save duplicate username', async () => {
      // Create first user
      await new User({
        username: 'sameusername',
        email: 'first@example.com',
        password: 'password123'
      }).save();
      
      // Try to create second user with same username
      const duplicateUser = new User({
        username: 'sameusername',
        email: 'second@example.com',
        password: 'password123'
      });
      
      let error;
      try {
        await duplicateUser.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    });
  });

  describe('Password hashing', () => {
    it('should hash the password before saving', async () => {
      const plainPassword = 'password123';
      const user = new User({
        username: 'hashtest',
        email: 'hash@example.com',
        password: plainPassword
      });
      
      await user.save();
      
      // Password should be hashed
      expect(user.password).not.toBe(plainPassword);
      
      // Should be able to compare password correctly
      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing wrong password', async () => {
      const user = new User({
        username: 'wrongpass',
        email: 'wrong@example.com',
        password: 'correctpassword'
      });
      
      await user.save();
      
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('User methods', () => {
    it('should update lastLogin timestamp', async () => {
      const user = new User({
        username: 'logintest',
        email: 'login@example.com',
        password: 'password123'
      });
      
      await user.save();
      const originalLogin = user.lastLogin;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await user.updateLastLogin();
      expect(user.lastLogin).not.toEqual(originalLogin);
      expect(user.lastLogin.getTime()).toBeGreaterThan(originalLogin.getTime());
    });
  });
});