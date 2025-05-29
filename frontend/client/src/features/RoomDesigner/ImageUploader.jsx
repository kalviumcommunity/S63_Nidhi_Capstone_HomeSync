import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ImageUploader = ({ onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      reader.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      };

      reader.onload = (e) => {
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          onImageUpload({
            src: e.target.result,
            width: img.width,
            height: img.height
          });
          setIsUploading(false);
          setUploadProgress(0);
        };
        img.src = e.target.result;
      };

      reader.onerror = () => {
        setUploadError('Error reading file');
        setIsUploading(false);
        setUploadProgress(0);
      };

      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Error processing image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div 
      className="image-uploader"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="upload-area">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label 
          htmlFor="image-upload"
          style={{
            display: 'block',
            padding: '20px',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            opacity: isUploading ? 0.7 : 1
          }}
        >
          {isUploading ? (
            <div>
              <div>Processing... {uploadProgress}%</div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div>Click to upload or drag and drop</div>
              <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                PNG, JPG up to 5MB
              </div>
            </div>
          )}
        </label>
      </div>

      {uploadError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}
        >
          {uploadError}
        </motion.div>
      )}

      <style jsx>{`
        .progress-bar {
          width: 100%;
          height: 4px;
          background: #eee;
          border-radius: 2px;
          margin-top: 10px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #4CAF50;
          border-radius: 2px;
        }
      `}</style>
    </motion.div>
  );
};

export default ImageUploader; 