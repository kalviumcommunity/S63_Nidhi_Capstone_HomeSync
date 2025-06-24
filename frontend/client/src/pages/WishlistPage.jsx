import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import Navbar from '../components/Navbar';
import { Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8" style={{ minHeight: '100vh', marginTop: '80px' }}>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
            <p className="mt-2 text-gray-400">Add items from the catalog to see them here.</p>
            <Link to="/room-designer">
                <button className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
                    Start Designing
                </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => {
              // Support both backend and frontend item shapes
              const product = item.productData || item;
              let image = product.image || item.image;
              // If image is a relative path and does not start with '/', add a leading slash
              if (image && !image.startsWith('/') && !image.startsWith('http')) {
                image = '/' + image;
              }
              const name = product.name || item.name;
              const price = product.price || item.price;
              const link = product.link || product.buyLink || item.link || item.buyLink || '#';
              return (
                <div
                  key={item.productId || item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 group"
                >
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-contain p-4 bg-gray-50"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">{name}</h2>
                    <p className="text-gray-600 mt-1 font-bold text-lg">{typeof price === 'number' ? `₹${price.toLocaleString()}` : price}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                        className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <ExternalLink size={16} />
                        Buy Now
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.productId || item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage; 