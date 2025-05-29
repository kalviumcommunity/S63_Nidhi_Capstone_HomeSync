import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product.id,
          productData: {
            name: product.name,
            image: product.image,
            price: product.price,
            brand: product.brand,
            link: product.link
          }
        })
      });

      if (response.ok) {
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleBuyNow = () => {
    window.open(product.link, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">Brand: {product.brand}</p>
            <p className="text-gray-600 mb-8">Category: {product.category}</p>
            
            <div className="space-y-4">
              <button
                onClick={handleAddToWishlist}
                disabled={isInWishlist}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
                  isInWishlist
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
              
              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-6 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 