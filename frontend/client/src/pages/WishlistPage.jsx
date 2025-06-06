import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { emitWishlistUpdate, socket, connected } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchWishlist = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/wishlist', {
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

  // Listen for real-time wishlist updates
  useEffect(() => {
    if (!socket || !connected) return;

    const handleWishlistUpdate = (data) => {
      if (data.action === 'add') {
        // Add item to wishlist if it doesn't exist
        setWishlistItems(prevItems => {
          const exists = prevItems.some(item => item.productId === data.item.productId);
          if (!exists) {
            return [...prevItems, data.item];
          }
          return prevItems;
        });
      } else if (data.action === 'remove') {
        // Remove item from wishlist
        setWishlistItems(prevItems => 
          prevItems.filter(item => item.productId !== data.item.productId)
        );
      }
    };

    // Subscribe to wishlist updates
    socket.on('wishlist:updated', handleWishlistUpdate);

    // Cleanup
    return () => {
      socket.off('wishlist:updated', handleWishlistUpdate);
    };
  }, [socket, connected]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Update local state
        const removedItem = wishlistItems.find(item => item.productId === productId);
        setWishlistItems(items => items.filter(item => item.productId !== productId));
        
        // Emit websocket event for real-time updates
        emitWishlistUpdate('remove', removedItem);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.productId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={item.productData.image}
                  alt={item.productData.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.productData.name}
                  </h2>
                  <p className="text-gray-600 mb-2">${item.productData.price.toFixed(2)}</p>
                  <p className="text-gray-600 mb-4">Brand: {item.productData.brand}</p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(item.productData.link, '_blank')}
                      className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Connection status indicator */}
        <div className="fixed bottom-4 right-4">
          <div className={`flex items-center px-3 py-1 rounded-full text-xs ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {connected ? 'Real-time connected' : 'Real-time disconnected'}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;