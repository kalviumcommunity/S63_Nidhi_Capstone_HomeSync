import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Editor.css';

const Editor = () => {
  return (
    <div 
      className="editor-container"
      style={{ backgroundImage: `url(/src/assets/StartDesigning.png)` }}
    >
      <div className="editor-content">
        <h2 className="editor-title">HomeSync and Interior Design</h2>
        <p className="editor-description">
          Simplify your design process with our platform, offering drag-and-drop tools and e-commerce integrations.
        </p>
        <Link to="/signup" className="editor-button">
          Start Designing
        </Link>
      </div>
    </div>
  );
};

export default Editor;
