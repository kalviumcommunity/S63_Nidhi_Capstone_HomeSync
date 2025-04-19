import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-200 to-blue-500 bg-[url('/src/assets/wavepattern.png')] bg-cover bg-fixed bg-[center_-20px] py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <img src="/src/assets/logo.png" alt="HomeSync Logo" className="w-8 h-8" />
          <span className="text-xl font-semibold text-green-600"></span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-16">
            <div>
              <Link to="/explore" className="text-blue-900 text-lg font-medium hover:text-blue-700 transition-colors duration-200">Explore</Link>
            </div>
            <div>
              <Link to="/editor" className="text-blue-900 text-lg font-medium hover:text-blue-700 transition-colors duration-200">Design</Link>
            </div>
            <div>
              <Link to="/about" className="text-blue-900 text-lg font-medium hover:text-blue-700 transition-colors duration-200">About</Link>
            </div>
          </div>
        </div>
        <div>
          <Link
            to="/start"
            className="bg-blue-900 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-lg font-semibold transition-all duration-300"
          >
            Start Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;