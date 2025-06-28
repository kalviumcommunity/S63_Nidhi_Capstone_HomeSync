import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.get('/api/wishlist');
      console.log('Fetched wishlist data:', response.data);
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item) => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return false;
    }

    try {
      // Convert price string to number (remove currency and commas)
      let price = item.price;
      if (typeof price === 'string') {
        price = Number(price.replace(/[^0-9.-]+/g, ""));
      }

      const productData = {
        name: item.name,
        image: item.image || item.src,
        price, // now a number
        brand: item.brand || 'HomeSync',
        link: item.productUrl || item.productLink || item.buyLink
      };

      console.log('Adding to wishlist:', { productId: item.id, productData });

      const response = await api.post('/api/wishlist', {
        productId: item.id,
        productData
      });

      console.log('Wishlist response:', response.data);
      setWishlistItems(prev => [...prev, response.data]);
      return true;
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Item already in wishlist');
      } else {
        console.error('Error adding to wishlist:', error);
        alert('Failed to add item to wishlist');
      }
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return false;

    try {
      await api.delete(`/api/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist');
      return false;
    }
  };

  const isItemInWishlist = (itemId) => {
    return wishlistItems.some(item => item.productId === itemId || item.id === itemId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlist: wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isItemInWishlist,
    getWishlistCount,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};