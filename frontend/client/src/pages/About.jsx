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
            devices. Our platform provides real-time previews and interactive customization tools
            to help you bring your designs to life.
          </p>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">Live Design Preview</h3>
            <p className="feature-description">
              See your designs update in real-time as you make changes—no guessing, no surprises.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Smart Recommendations</h3>
            <p className="feature-description">
              Get personalized suggestions based on your style preferences and room dimensions.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Interactive Layout Editor</h3>
            <p className="feature-description">
              Customize and experiment with layouts using an easy-to-use drag-and-drop interface.
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
