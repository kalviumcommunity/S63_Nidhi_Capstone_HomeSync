import React, { useState } from 'react';
import SidebarCatalog from './SidebarCatalog';
import CanvasEditor from './CanvasEditor';
import ImageUploader from './ImageUploader';
import Navbar from '../../components/Navbar';
import { Home } from 'lucide-react';

const RoomDesigner = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleImageUpload = (image) => setBackgroundImage(image);
  const resetCanvas = () => setBackgroundImage('');

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f3f4f6' }}>
        {/* Sidebar on the left */}
        <div style={{
          width: '128px', // 32 * 4 = 128px
          minWidth: '128px',
          maxWidth: '128px',
          height: '100%',
          background: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          boxShadow: '0 0 8px 0 rgba(0,0,0,0.03)'
        }}>
          <SidebarCatalog />
        </div>
        {/* Canvas area fills the rest */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ background: '#fff', padding: '8px', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'flex-end' }}>
            {backgroundImage && (
              <button
                onClick={resetCanvas}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ef4444',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Home size={16} />
                Change Room
              </button>
            )}
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {!backgroundImage ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            ) : (
              <div style={{ width: '100%', height: '100%' }}>
                <CanvasEditor backgroundImage={backgroundImage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDesigner; 