import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

// Import images
import discoverMoreImage from '../assets/DiscoverMore.png';
import startDesigningImage from '../assets/StartDesigning.png';
import exploreMoreImage from '../assets/ExploreMore.png';
import viewDetailsImage from '../assets/ViewDetails.png';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <section
        className="section"
        style={{ backgroundImage: `url(${discoverMoreImage})` }}
      >
        <div className="section-content">
          <h2 className="section-title">Design Your Dream Space Effortlessly</h2>
          <p className="section-description">
            Unlock HomeSync's potential with features like drag-and-drop editing and e-commerce integration to transform your room.
          </p>
          <Link to="/signup" className="section-button">
            Discover More
          </Link>
        </div>
      </section>

      {/* Interior Design Section */}
      <section
        className="section"
        style={{ backgroundImage: `url(${startDesigningImage})` }}
      >
        <div className="section-content">
          <h2 className="section-title">HomeSync and Interior Design</h2>
          <p className="section-description">
            Simplify your design process with our platform, offering drag-and-drop tools and e-commerce integrations.
          </p>
          <Link to="/signup" className="section-button">
            Start Designing
          </Link>
        </div>
      </section>

      {/* Living Space Section */}
      <section
        className="section"
        style={{ backgroundImage: `url(${exploreMoreImage})` }}
      >
        <div className="section-content">
          <h2 className="section-title">Transform Your Living Space with HomeSync</h2>
          <p className="section-description">
            Elevate your decor with curated styles, live previews, and seamless shopping from top retailers.
          </p>
          <Link to="/explore" className="section-button">
            Explore More
          </Link>
        </div>
      </section>

      {/* Design Experience Section */}
      <section
        className="section"
        style={{ backgroundImage: `url(${viewDetailsImage})` }}
      >
        <div className="section-content">
          <h2 className="section-title">Enhance Your Design Experience with HomeSync</h2>
          <p className="section-description">
            Discover how HomeSync streamlines your design process with innovative tools and real-time updates.
          </p>
          <Link to="/view" className="section-button">
            View Details
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
