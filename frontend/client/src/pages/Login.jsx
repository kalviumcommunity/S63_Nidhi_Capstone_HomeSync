import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert(res.data.message);
      navigate('/dashboard'); // Change this route as needed
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-600 to-green-700 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-green-700 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
