import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Simulate password reset here
    alert('Password reset successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-600 to-green-700 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="newPassword"
            type="password"
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
