import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1 className="about-title">About HomeSync</h1>
        <p className="about-subtitle">
          Transforming the way you design and visualize your living spaces with cutting-edge technology
          and intuitive design tools.
        </p>
      </div>

      <div className="about-content">
        <div className="about-card">
          <h2 className="card-title">
            <span className="card-icon">💡</span>
            Our Vision
          </h2>
          <p className="card-description">
            We envision a world where everyone can easily create and visualize their dream spaces.
            Our platform empowers users to design, customize, and transform their living environments
            with just a few clicks.
          </p>
        </div>

        <div className="about-card">
          <h2 className="card-title">
            <span className="card-icon">🎨</span>
            Design Tools
          </h2>
          <p className="card-description">
            Our intuitive design tools make it easy to create beautiful spaces. From furniture
            placement to color schemes, our platform provides everything you need to bring your
            vision to life.
          </p>
        </div>

        <div className="about-card">
          <h2 className="card-title">
            <span className="card-icon">📱</span>
            Technology
          </h2>
          <p className="card-description">
            Built with modern web technologies, HomeSync offers a seamless experience across all
            devices. Our platform uses advanced 3D rendering and real-time previews to help you
            visualize your designs.
          </p>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">Real-time 3D Preview</h3>
            <p className="feature-description">
              See your designs come to life with our advanced 3D rendering technology.
              Make changes and see instant results.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Smart Recommendations</h3>
            <p className="feature-description">
              Get personalized suggestions based on your style preferences and room dimensions.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Virtual Room Tours</h3>
            <p className="feature-description">
              Take a virtual walkthrough of your designed space before making any changes.
            </p>
          </div>
        </div>
      </div>

      <div className="benefits-section">
        <h2 className="section-title">Why Choose HomeSync?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3 className="benefit-title">Save Time & Money</h3>
            <p className="benefit-description">
              Avoid costly mistakes by visualizing your space before making any purchases.
            </p>
          </div>
          <div className="benefit-card">
            <h3 className="benefit-title">Endless Possibilities</h3>
            <p className="benefit-description">
              Experiment with different styles and layouts without any commitment.
            </p>
          </div>
          <div className="benefit-card">
            <h3 className="benefit-title">Professional Results</h3>
            <p className="benefit-description">
              Create designs that look like they were made by professional interior designers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
