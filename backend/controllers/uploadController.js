const path = require('path');
const fs = require('fs');

// Upload image
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = '/uploads/' + req.file.filename;

  res.status(201).json({
    message: 'Image uploaded successfully',
    imageUrl
  });
};

// Get latest uploaded image
const getLatestImage = (req, res) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading uploads directory' });
    }

    if (!files.length) {
      return res.status(404).json({ message: 'No uploaded images found' });
    }

    // Sort files by modified time descending
    files.sort((a, b) => {
      const aTime = fs.statSync(path.join(uploadsDir, a)).mtime.getTime();
      const bTime = fs.statSync(path.join(uploadsDir, b)).mtime.getTime();
      return bTime - aTime;
    });

    const latestImage = files[0];
    const imageUrl = '/uploads/' + latestImage;

    res.json({ imageUrl });
  });
};

module.exports = {
  uploadImage,
  getLatestImage
};
