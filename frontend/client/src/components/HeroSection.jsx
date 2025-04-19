import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ title, description, buttonText, buttonLink, imageUrl }) => {
  return (
    <section
      className="bg-cover bg-center min-h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="max-w-7xl text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-8">{description}</p>
        <Link
          to={buttonLink}
          className="bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-200"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;