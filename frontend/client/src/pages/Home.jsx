import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <HeroSection
        title="Design Your Dream Space Effortlessly"
        description="Unlock HomeSync's potential with features like drag-and-drop editing and e-commerce integration to transform your room."
        buttonText="Discover More"
        buttonLink="/discover"
        imageUrl="/src/assets/DiscoverMore.png" // Replace with your actual PNG file name
      />
      <FeatureSection
        title="HomeSync and Interior Design"
        description="Simplify your design process with our platform, offering drag-and-drop tools and e-commerce integrations."
        buttonText="Start Designing"
        buttonLink="/editor"
        imageUrl="/src/assets/StartDesigning.png" // Replace with your actual PNG file name
      />
      <FeatureSection
        title="Transform Your Living Space with HomeSync"
        description="Elevate your decor with curated styles, live previews, and seamless shopping from top retailers."
        buttonText="Explore More"
        buttonLink="/explore"
        imageUrl="/src/assets/ExploreMore.png" // Replace with your actual PNG file name
      />
      <FeatureSection
        title="Enhance Your Design Experience with HomeSync"
        description="Discover how HomeSync streamlines your design process with innovative tools and real-time updates."
        buttonText="View Details"
        buttonLink="/view"
        imageUrl="/src/assets/ViewDetails.png" // Replace with your actual PNG file name
      />
      <Footer />
    </div>
  );
};

export default Home;