import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center">
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-6 w-80 max-w-full border-0">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-extrabold mb-4 text-center text-green-900">Signup</h2>
          <input
            name="name"
            onChange={handleChange}
            placeholder="Name"
            className="w-full mb-3 p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400"
            required
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-3 p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400"
            required
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-3 p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full mb-5 p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold transition duration-300"
          >
            Sign Up
          </button>
          <p className="mt-3 text-center text-green-900 text-sm">
            Already a user?{' '}
            <Link to="/login" className="text-green-700 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
