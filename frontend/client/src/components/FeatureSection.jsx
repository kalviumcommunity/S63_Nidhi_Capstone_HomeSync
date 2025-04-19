import React from 'react';
import { Link } from 'react-router-dom';

const FeatureSection = ({ title, description, buttonText, buttonLink, imageUrl }) => {
  return (
    <section
      className="bg-cover bg-center min-h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="max-w-7xl text-center text-white bg-gray-800 bg-opacity-50 p-6 rounded-lg">
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <p className="text-lg mb-8">{description}</p>
        <Link
          to={buttonLink}
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default FeatureSection;