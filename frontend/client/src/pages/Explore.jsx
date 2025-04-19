import React from 'react';
import FeatureSection from '../components/FeatureSection';

const Explore = () => {
  return (
    <FeatureSection
      title="Transform Your Living Space with HomeSync"
      description="Elevate your decor with curated styles, live previews, and seamless shopping from top retailers."
      buttonText="Explore More"
      buttonLink="/explore"
      imageUrl="/src/assets/ExploreMore.png"
    />
  );
};

export default Explore;