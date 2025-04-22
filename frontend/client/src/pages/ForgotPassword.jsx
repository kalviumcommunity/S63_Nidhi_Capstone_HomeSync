import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setEmail(e.target.value);
  };

  const handleClear = () => {
    setEmail('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[350px]">
        {/* Form Container */}
        <div className="bg-[#e6e6e6] rounded-[40px] p-8 flex flex-col items-center">
          {/* Header */}
          <h2 className="text-xl font-bold mb-6 text-center">Forgot Password</h2>
          
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
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-8 px-4 rounded-full bg-white focus:outline-none text-left placeholder:text-center text-sm"
                  required
                />
                {email && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className="text-center text-sm">
                <p className={message.includes('Failed') ? 'text-red-500' : 'text-green-500'}>
                  {message}
                </p>
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#c4c4c4] text-black font-medium py-1 px-4 rounded-full hover:bg-[#b4b4b4] transition-colors text-sm"
              >
                Send Reset Link
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <Link to="/login" className="text-sm text-black hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
