import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUpload, FaCheck } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    // Fetch any previously uploaded image when component mounts
    fetchUploadedImage();
  }, []);

  const fetchUploadedImage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/upload/latest', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setUploadedImage(data.imageUrl);
          setIsUploaded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching uploaded image:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus('');
      // Show preview of selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadStatus('Please select an image file');
      setSelectedFile(null);
      setUploadedImage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/upload/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('Image uploaded successfully!');
        setIsUploaded(true);
        setUploadedImage(data.imageUrl);
      } else {
        setUploadStatus(data.message || 'Error uploading image');
        setIsUploaded(false);
      }
    } catch (error) {
      setUploadStatus('Error uploading image');
      setIsUploaded(false);
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="dashboard-main">
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <FaHome className="nav-icon" />
          <span>HomeSync</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to HomeSync</h1>
        <p className="dashboard-subtitle">Your Personal File Management System</p>

        <div className="upload-section">
          <h2>Upload Files</h2>
          <div className="upload-container">
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              id="file-input"
              accept="image/*"
            />
            <label htmlFor="file-input" className="file-label">
              <FaUpload className="upload-icon" />
              <span>Choose a file</span>
            </label>
            <button 
              className={`upload-button ${isUploaded ? 'uploaded' : ''}`} 
              onClick={handleUpload}
              disabled={isUploaded}
            >
              {isUploaded ? 'Uploaded' : 'Upload'}
            </button>
          </div>
          {uploadStatus && (
            <div className={`status-message ${uploadStatus.includes('success') ? 'success' : 'error'}`}>
              {uploadStatus.includes('success') && <FaCheck className="status-icon" />}
              {uploadStatus}
            </div>
          )}
        </div>

        <div className="preview-section">
          <h2>{isUploaded ? 'Uploaded Image' : 'Selected Image Preview'}</h2>
          <div className="image-preview">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded preview" className="preview-image" />
            ) : (
              <p>No image selected</p>
            )}
          </div>
          {selectedFile && !isUploaded && (
            <div className="file-info">
              <p>Name: {selectedFile.name}</p>
              <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <p>Type: {selectedFile.type}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 