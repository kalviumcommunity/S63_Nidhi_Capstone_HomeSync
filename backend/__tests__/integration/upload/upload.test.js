const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { createTestUser, authHeader } = require('../../testUtils');

// Mock the upload controller
jest.mock('../../../controllers/uploadController', () => ({
  uploadImage: (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Mock successful upload
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  },
  getLatestImage: (req, res) => {
    // Mock getting latest image
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Return mock image data
    res.json({
      imageUrl: '/uploads/test-image.jpg',
      uploadedAt: new Date()
    });
  }
}));

// Mock the auth middleware
jest.mock('../../../middleware/authMiddleware', () => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Set mock user
    req.user = { _id: 'test-user-id' };
    next();
  };
});

// Create a test app with multer
const express_app = express();
express_app.use(express.json());

// Setup multer for testing
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use a temporary test uploads directory
    const uploadDir = path.join(__dirname, '..', '..', 'temp-uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Import routes
const uploadRoutes = require('../../../routes/uploadRoutes');

// Apply routes to test app
express_app.use('/api/upload', uploadRoutes);

describe('Upload Routes', () => {
  let testUser, token;
  
  beforeEach(async () => {
    // Create a test user
    const userResult = await createTestUser();
    testUser = userResult.user;
    token = userResult.token;
  });
  
  afterAll(() => {
    // Clean up temp uploads directory
    const uploadDir = path.join(__dirname, '..', '..', 'temp-uploads');
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
  });

  describe('POST /api/upload/upload', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(express_app)
        .post('/api/upload/upload')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });
  });

  describe('GET /api/upload/latest', () => {
    it('should return latest image for authenticated user', async () => {
      const response = await request(express_app)
        .get('/api/upload/latest')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('imageUrl');
      expect(response.body).toHaveProperty('uploadedAt');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(express_app)
        .get('/api/upload/latest')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });
  });
});