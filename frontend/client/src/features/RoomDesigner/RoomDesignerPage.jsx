import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RoomDesignerModern.css';
import CanvasEditor from './CanvasEditor';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = [
  {
    name: 'Furniture',
    items: [
      { name: 'Bed', catalog: [
        { label: 'King Bed', src: '/assets/furniture/bed-king.png', defaultWidth: 200, defaultHeight: 120 },
        { label: 'Queen Bed', src: '/assets/furniture/bed-queen.png', defaultWidth: 180, defaultHeight: 110 },
        { label: 'Single Bed', src: '/assets/furniture/bed-single.png', defaultWidth: 120, defaultHeight: 100 },
      ] },
      { name: 'Sofa', catalog: [
        { label: 'Sectional', src: '/assets/furniture/sofa-1.png', defaultWidth: 200, defaultHeight: 120 },
        { label: 'Loveseat', src: '/assets/furniture/sofa-2.png', defaultWidth: 160, defaultHeight: 100 },
        { label: 'Sleeper Sofa', src: '/assets/furniture/sofa-3.png', defaultWidth: 180, defaultHeight: 110 },
      ] },
      { name: 'Chair', catalog: [
        { label: 'Armchair', src: '/assets/furniture/chair-1.png', defaultWidth: 80, defaultHeight: 100 },
        { label: 'Dining Chair', src: '/assets/furniture/chair-2.png', defaultWidth: 70, defaultHeight: 90 },
        { label: 'Recliner', src: '/assets/furniture/chair-3.png', defaultWidth: 90, defaultHeight: 110 },
      ] },
      { name: 'Table', catalog: [
        { label: 'Coffee Table', src: '/assets/furniture/table-1.png', defaultWidth: 120, defaultHeight: 60 },
        { label: 'Dining Table', src: '/assets/furniture/table-2.png', defaultWidth: 150, defaultHeight: 80 },
        { label: 'Side Table', src: '/assets/furniture/table-3.png', defaultWidth: 60, defaultHeight: 60 },
      ] },
    ],
  },
  {
    name: 'Wall Decor',
    items: [
      { name: 'Painting', catalog: ['Abstract', 'Landscape', 'Portrait'] },
      { name: 'Clock', catalog: ['Modern', 'Classic', 'Digital'] },
    ],
  },
  {
    name: 'Showcase Items',
    items: [
      { name: 'Vase', catalog: ['Ceramic', 'Glass', 'Metal'] },
      { name: 'Bookshelf', catalog: ['Wooden', 'Metal', 'Floating'] },
    ],
  },
  {
    name: 'Aesthetic Elements',
    items: [
      { name: 'Plant', catalog: ['Succulent', 'Fern', 'Palm'] },
      { name: 'Lamp', catalog: ['Floor Lamp', 'Table Lamp', 'Pendant'] },
    ],
  },
];

export default function RoomDesignerPage() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [roomImage, setRoomImage] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Add item to canvas when catalog entry is clicked
  const handleAddCatalogItem = (catItem) => {
    const newItem = {
      id: uuidv4(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100,
      width: catItem.defaultWidth,
      height: catItem.defaultHeight,
      itemSrc: catItem.src,
      rotation: 0,
      catalogLabel: catItem.label,
    };
    setItems((prev) => [...prev, newItem]);
    setHoveredCategory(null);
    setHoveredItem(null);
  };

  // CanvasEditor handlers
  const updateCanvasState = (newItems, newBg) => {
    setItems(newItems);
    if (newBg) setBackgroundImage(newBg);
  };

  return (
    <div className="room-designer-root" style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Left Sidebar */}
      <div className="sidebar-modern" style={{ position: 'relative', zIndex: 10 }}>
        <h2>Categories</h2>
        <ul>
          {CATEGORIES.map((cat) => (
            <li
              key={cat.name}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={hoveredCategory === cat.name ? 'active' : ''}
            >
              {cat.name}
              {/* Sub-sidebar for items */}
              <AnimatePresence>
                {hoveredCategory === cat.name && (
                  <motion.div
                    className="sub-sidebar"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: 0,
                      minWidth: 180,
                      background: 'var(--sidebar-bg)',
                      borderRadius: '14px',
                      boxShadow: '0 4px 24px rgba(23,64,77,0.13)',
                      padding: '1.2rem 1rem',
                      marginLeft: 10,
                      zIndex: 20,
                    }}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <ul style={{ margin: 0, padding: 0 }}>
                      {cat.items.map((item) => (
                        <li
                          key={item.name}
                          style={{
                            padding: '0.6rem 0.8rem',
                            borderRadius: 8,
                            marginBottom: 6,
                            color: hoveredItem === item.name ? 'var(--accent)' : 'var(--text-light)',
                            background: hoveredItem === item.name ? 'rgba(79,209,197,0.13)' : 'none',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'background 0.2s, color 0.2s',
                          }}
                          onMouseEnter={() => setHoveredItem(item.name)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {item.name}
                          {/* Catalog pop-out */}
                          <AnimatePresence>
                            {hoveredItem === item.name && (
                              <motion.div
                                className="catalog-popout"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                style={{
                                  position: 'absolute',
                                  left: '100%',
                                  top: 0,
                                  minWidth: 220,
                                  background: '#fff',
                                  color: '#17404d',
                                  borderRadius: '14px',
                                  boxShadow: '0 4px 24px rgba(23,64,77,0.13)',
                                  padding: '1.2rem 1rem',
                                  marginLeft: 10,
                                  zIndex: 30,
                                }}
                                onMouseEnter={() => setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                              >
                                <ul style={{ margin: 0, padding: 0 }}>
                                  {item.catalog.map((catItem) => (
                                    <li
                                      key={catItem.label}
                                      style={{
                                        padding: '0.5rem 0.7rem',
                                        borderRadius: 7,
                                        marginBottom: 5,
                                        background: '#f1f9fa',
                                        color: '#17404d',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        transition: 'background 0.2s',
                                      }}
                                      onClick={() => handleAddCatalogItem(catItem)}
                                    >
                                      {catItem.src && (
                                        <img src={catItem.src} alt={catItem.label} style={{ width: 32, height: 32, borderRadius: 6, background: '#e6f7fa' }} />
                                      )}
                                      {catItem.label}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      {/* Center Canvas Area */}
      <div className="room-canvas-modern" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="canvas-card" style={{ minHeight: 480, minWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CanvasEditor
            items={items}
            backgroundImage={backgroundImage}
            updateCanvasState={updateCanvasState}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        </div>
      </div>

      {/* Right Sidebar (Controls) */}
      <div className="controls-modern" style={{ minHeight: '100vh', zIndex: 10 }}>
        <h3>Item Editing</h3>
        <div className="slider-group">
          <label>Size</label>
          <input type="range" />
        </div>
        <div className="slider-group">
          <label>Position</label>
          <input type="range" />
        </div>
        <div className="slider-group">
          <label>Opacity</label>
          <input type="range" />
        </div>
        <button>Save Design</button>
      </div>
    </div>
  );
} 