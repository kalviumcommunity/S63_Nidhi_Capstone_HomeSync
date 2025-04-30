const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadImage, getLatestImage } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Upload image route (protected)
router.post('/upload', protect, upload.single('image'), uploadImage);

// Get latest uploaded image route (protected)
router.get('/latest', protect, getLatestImage);

module.exports = router;
