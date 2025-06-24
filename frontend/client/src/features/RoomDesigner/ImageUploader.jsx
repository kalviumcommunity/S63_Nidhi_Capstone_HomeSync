import React from 'react';
import { Upload } from 'lucide-react';

const ImageUploader = ({ onImageUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Upload a room image</h3>
        <p className="mt-1 text-sm text-gray-600">Drag and drop or click to select a file</p>
        <div className="mt-6">
            <input
                type="file"
                id="file-upload"
                name="file-upload"
                className="sr-only"
                accept="image/*"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 py-2 px-4 border border-transparent shadow-sm text-sm">
                <span>Select an image</span>
            </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader; 