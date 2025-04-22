import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log('Form submitted:', formData);
  };

  const clearField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[350px]">
        {/* Form Container */}
        <div className="bg-[#e6e6e6] rounded-[40px] p-8 flex flex-col items-center">
          {/* Header */}
          <h2 className="text-xl font-bold mb-6 text-center">Sign Up:</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[250px]">
            {/* Name Field */}
            <div className="mb-6 flex flex-col items-center">
              <label className="block font-medium text-black mb-1 w-full text-center">
                Name:
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full h-8 px-4 rounded-full bg-white focus:outline-none text-left placeholder:text-center text-sm"
                />
                {formData.name && (
                  <button
                    type="button"
                    onClick={() => clearField('name')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

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
                    onClick={() => clearField('email')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 flex flex-col items-center">
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
                    onClick={() => clearField('password')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-8 flex flex-col items-center">
              <label className="block font-medium text-black mb-1 w-full text-center">
                Confirm Password:
              </label>
              <div className="relative w-full">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-8 px-4 rounded-full bg-white focus:outline-none text-left placeholder:text-center text-sm"
                />
                {formData.confirmPassword && (
                  <button
                    type="button"
                    onClick={() => clearField('confirmPassword')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {/* Sign up with Google */}
              <button 
                type="button"
                className="text-sm text-black"
              >
                Sign up with google
              </button>

              {/* Sign In Button */}
              <button
                type="submit"
                className="bg-[#c4c4c4] text-black font-medium py-1 px-4 rounded-full hover:bg-[#b4b4b4] transition-colors text-sm"
              >
                Sign in
              </button>

              {/* Login Link */}
              <div className="mt-2 text-center">
                <span className="text-sm text-black">
                  Already a user? <Link to="/login" className="hover:underline text-blue-600">Login</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
