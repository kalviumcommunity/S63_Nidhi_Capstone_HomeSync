import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SidebarCatalog = () => {
  const [wishlist, setWishlist] = useState([]);
  const catalogItems = [
    { 
      id: 'chair', 
      name: 'Chair', 
      type: 'image', 
      src: '/assets/furniture/chair-1.png', 
      defaultWidth: 80, 
      defaultHeight: 100,
      productUrl: 'https://example.com/chair',
      price: 199.99
    },
    { 
      id: 'table', 
      name: 'Table', 
      type: 'image', 
      src: '/assets/furniture/table-1.png', 
      defaultWidth: 150, 
      defaultHeight: 100,
      productUrl: 'https://example.com/table',
      price: 299.99
    },
    { 
      id: 'lamp', 
      name: 'Lamp', 
      type: 'image', 
      src: '/assets/furniture/lamp-1.png', 
      defaultWidth: 60, 
      defaultHeight: 80,
      productUrl: 'https://example.com/lamp',
      price: 49.99
    },
    { 
      id: 'sofa', 
      name: 'Sofa', 
      type: 'image', 
      src: '/assets/furniture/sofa-1.png', 
      defaultWidth: 200, 
      defaultHeight: 120,
      productUrl: 'https://example.com/sofa',
      price: 899.99
    },
  ];

  const handleDragStart = (e, item) => {
    // We'll use this to pass item data to the canvas on drop
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const toggleWishlist = (item) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(wishlistItem => wishlistItem.id === item.id);
      if (isInWishlist) {
        return prev.filter(wishlistItem => wishlistItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isInWishlist = (itemId) => {
    return wishlist.some(item => item.id === itemId);
  };

  return (
    <div className="sidebar-catalog">
      <h4>Catalog</h4>
      <ul>
        {catalogItems.map((item) => (
          <motion.li
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{ 
              cursor: 'grab', 
              padding: '5px', 
              border: '1px solid #eee', 
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={item.src}
                alt={item.name} 
                style={{ width: '40px', height: '40px', marginRight: '10px', verticalAlign: 'middle' }} 
              />
              <div>
                <div>{item.name}</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>${item.price}</div>
              </div>
            </div>
            <div>
              <button 
                onClick={() => toggleWishlist(item)}
                style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isInWishlist(item.id) ? '#ff4444' : '#ccc'
                }}
              >
                ♥
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      {wishlist.length > 0 && (
        <div className="wishlist-section">
          <h4>Wishlist</h4>
          <ul>
            {wishlist.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ 
                  padding: '5px', 
                  border: '1px solid #eee', 
                  marginBottom: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={item.src} 
                    alt={item.name} 
                    style={{ width: '30px', height: '30px', marginRight: '10px' }} 
                  />
                  <div>
                    <div>{item.name}</div>
                    <div style={{ fontSize: '0.8em', color: '#666' }}>${item.price}</div>
                  </div>
                </div>
                <div>
                  <a 
                    href={item.productUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ marginRight: '10px' }}
                  >
                    View
                  </a>
                  <button 
                    onClick={() => toggleWishlist(item)}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ff4444'
                    }}
                  >
                    ×
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidebarCatalog; 