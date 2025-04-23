import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '@fontsource/poppins/700.css'; // Bold Poppins

const HeroSection = ({ title, description, buttonText, buttonLink, imageUrl }) => {
  return (
    <section
      className="bg-cover bg-center min-h-screen flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-3xl text-center text-white bg-black bg-opacity-50 p-10 rounded-2xl shadow-lg"
      >
        <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h2>
        <p className="text-lg mb-8 leading-relaxed">{description}</p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to={buttonLink}
            className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold transition-colors duration-300 hover:bg-green-100 shadow-md"
          >
            {buttonText}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
