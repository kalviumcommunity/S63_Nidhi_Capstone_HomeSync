import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Heart, ShoppingCart, Trash2, Sparkles } from 'lucide-react';
import '../styles/WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wishlist-loading">
          <div className="wishlist-loading-spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      </>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">💝</div>
            <h1 className="wishlist-empty-title">Your Wishlist</h1>
            <p className="wishlist-empty-message">
              Your wishlist is empty. Start adding your favorite furniture and decor items!
            </p>
            <button 
              onClick={() => navigate('/room-designer')}
              className="wishlist-buy-button"
              style={{ maxWidth: '200px' }}
            >
              <Sparkles size={20} style={{ marginRight: '8px' }} />
              Start Designing
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">Your Wishlist</h1>
          <p className="wishlist-subtitle">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        
        <div className="wishlist-grid">
          {wishlistItems.map((item, index) => (
            <div 
              key={item.productId} 
              className="wishlist-card"
              style={{ '--card-index': index }}
            >
              <img
                src={item.productData.image}
                alt={item.productData.name}
                className="wishlist-card-image"
                onError={(e) => {
                  console.log('Image failed to load:', item.productData.image);
                  e.target.src = '/src/assets/placeholder.png';
                  e.target.alt = 'Product image not available';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', item.productData.image);
                }}
              />
              <div className="wishlist-card-content">
                <h2 className="wishlist-card-title">
                  {item.productData.name}
                </h2>
                <p className="wishlist-card-price">
                  ${item.productData.price ? item.productData.price.toFixed(2) : '0.00'}
                </p>
                <p className="wishlist-card-brand">
                  Brand: {item.productData.brand || 'HomeSync'}
                </p>
                
                <div className="wishlist-card-actions">
                  <button
                    onClick={() => window.open(item.productData.link, '_blank')}
                    className="wishlist-buy-button"
                  >
                    <ShoppingCart size={18} style={{ marginRight: '8px' }} />
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="wishlist-remove-button"
                  >
                    <Trash2 size={18} style={{ marginRight: '8px' }} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;