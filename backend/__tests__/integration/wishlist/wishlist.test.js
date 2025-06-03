const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const wishlistRoutes = require('../../../routes/wishlistRoutes');
const Wishlist = require('../../../models/Wishlist');
const User = require('../../../models/User');
const { createTestUser, authHeader } = require('../../testUtils');

// Mock auth middleware
jest.mock('../../../middleware/auth', () => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Extract user ID from token (assuming valid token format)
    const token = req.headers.authorization.split(' ')[1];
    req.user = { _id: req.headers['x-user-id'] || 'test-user-id' };
    next();
  };
});

// Create a test app
const app = express();
app.use(express.json());
app.use('/', wishlistRoutes);

describe('Wishlist Routes', () => {
  let testUser, token, userId;

  beforeEach(async () => {
    // Create a test user
    const userResult = await createTestUser();
    testUser = userResult.user;
    token = userResult.token;
    userId = testUser._id.toString();
  });

  describe('GET /', () => {
    it('should return empty wishlist for new user', async () => {
      const response = await request(app)
        .get('/')
        .set('Authorization', `Bearer ${token}`)
        .set('x-user-id', userId)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return user wishlist items', async () => {
      // Add items to wishlist
      const wishlistItems = [
        {
          userId: testUser._id,
          productId: 'product-1',
          productData: { name: 'Test Product 1', price: 99.99 }
        },
        {
          userId: testUser._id,
          productId: 'product-2',
          productData: { name: 'Test Product 2', price: 149.99 }
        }
      ];

      await Wishlist.insertMany(wishlistItems);

      const response = await request(app)
        .get('/')
        .set('Authorization', `Bearer ${token}`)
        .set('x-user-id', userId)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].productId).toBe('product-1');
      expect(response.body[1].productId).toBe('product-2');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });
  });

  describe('POST /', () => {
    it('should add item to wishlist', async () => {
      const productData = {
        productId: 'new-product-id',
        productData: {
          name: 'New Product',
          price: 199.99,
          image: 'product.jpg'
        }
      };

      const response = await request(app)
        .post('/')
        .set('Authorization', `Bearer ${token}`)
        .set('x-user-id', userId)
        .send(productData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('productId', productData.productId);
      expect(response.body.productData).toEqual(productData.productData);
      expect(response.body.userId.toString()).toBe(userId);

      // Verify item was saved to database
      const savedItem = await Wishlist.findOne({ 
        userId: userId,
        productId: productData.productId
      });
      
      expect(savedItem).not.toBeNull();
      expect(savedItem.productData).toEqual(expect.objectContaining(productData.productData));
    });

    it('should return 400 if item already in wishlist', async () => {
      // Add item to wishlist first
      const existingItem = {
        userId: testUser._id,
        productId: 'existing-product',
        productData: { name: 'Existing Product' }
      };
      
      await new Wishlist(existingItem).save();

      // Try to add the same item again
      const response = await request(app)
        .post('/')
        .set('Authorization', `Bearer ${token}`)
        .set('x-user-id', userId)
        .send({
          productId: existingItem.productId,
          productData: existingItem.productData
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Item already in wishlist');
    });
  });

  describe('DELETE /:productId', () => {
    it('should remove item from wishlist', async () => {
      // Add item to wishlist first
      const wishlistItem = {
        userId: testUser._id,
        productId: 'product-to-delete',
        productData: { name: 'Product to Delete' }
      };
      
      await new Wishlist(wishlistItem).save();

      const response = await request(app)
        .delete(`/${wishlistItem.productId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('x-user-id', userId)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Item removed from wishlist');

      // Verify item was removed from database
      const deletedItem = await Wishlist.findOne({ 
        userId: userId,
        productId: wishlistItem.productId
      });
      
      expect(deletedItem).toBeNull();
    });

    it('should return 404 if item not found in wishlist', async () => {
      const response = await request(app)
        .delete('/nonexistent-product')
        .set('Authorization', `Bearer ${token}`)
        .set('x-user-id', userId)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Item not found in wishlist');
    });
  });
});