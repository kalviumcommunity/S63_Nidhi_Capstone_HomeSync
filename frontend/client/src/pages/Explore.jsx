import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Explore.css';

const Explore = () => {
  return (
    <div className="explore-container">
      <div className="explore-content">
        <h1 className="explore-title">Transform Your Living Space</h1>
        <p className="explore-description">
          Discover beautiful home designs and create your dream space with our intuitive design tools.
          Start your journey to the perfect home today.
        </p>
        <Link to="/signup" className="explore-button">
          Let's Explore
        </Link>
      </div>
    </div>
  );
};

export default Explore;