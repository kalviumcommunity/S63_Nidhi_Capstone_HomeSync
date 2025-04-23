import React from 'react';
import FeatureSection from '../components/FeatureSection';

const Editor = () => {
  return (
    <FeatureSection
      title="HomeSync and Interior Design"
      description="Simplify your design process with our platform, offering drag-and-drop tools and e-commerce integrations."
      buttonText="Start Designing"
      buttonLink="/signup"
      imageUrl="/src/assets/StartDesigning.png"
    />
  );
};

export default Editor;
