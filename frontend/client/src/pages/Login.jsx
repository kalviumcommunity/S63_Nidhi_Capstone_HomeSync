import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import logo from '../assets/logo.png'; // Use your logo path here

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = field => {
    setFormData({ ...formData, [field]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert(res.data.message);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[350px]">
        {/* Form Container */}
        <div className="bg-[#e6e6e6] rounded-[40px] p-8 flex flex-col items-center">
          {/* Header */}
          <h2 className="text-xl font-bold mb-6 text-center">Login:</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[250px]">
            {/* Email Field */}
            <div className="mb-6 flex flex-col items-center">
              <label className="block font-medium text-black mb-1 w-full text-center">
                Email:
              </label>
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-8 px-4 rounded-full bg-white focus:outline-none text-left placeholder:text-center text-sm"
                />
                {formData.email && (
                  <button
                    type="button"
                    onClick={() => handleClear('email')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-8 flex flex-col items-center">
              <label className="block font-medium text-black mb-1 w-full text-center">
                Password:
              </label>
              <div className="relative w-full">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-8 px-4 rounded-full bg-white focus:outline-none text-left placeholder:text-center text-sm"
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => handleClear('password')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {/* Sign in with Google */}
              <button 
                type="button"
                className="text-sm text-black"
              >
                Sign in with google
              </button>

              {/* Login Button */}
              <button
                type="submit"
                className="bg-[#c4c4c4] text-black font-medium py-1 px-4 rounded-full hover:bg-[#b4b4b4] transition-colors text-sm"
              >
                Login
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link to="/forgot-password" className="text-sm text-black hover:underline">
                  Forgot your password?
                </Link>
              </div>

              {/* Signup Link */}
              <div className="mt-2 text-center">
                <span className="text-sm text-black">
                  New user? <Link to="/signup" className="hover:underline text-blue-600">Signup</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
