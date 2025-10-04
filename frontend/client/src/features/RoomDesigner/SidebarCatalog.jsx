import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { products } from '../../data/dummyProducts';
import { useWishlist } from '../../context/WishlistContext';
import { Heart } from 'lucide-react';
import './SidebarCatalog.css';

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <img src={product.image} alt={product.name} className="w-32 h-32 object-contain mx-auto mb-4" />
        <h2 className="text-lg font-bold text-center mb-2">{product.name}</h2>
        <p className="text-center text-indigo-600 font-semibold mb-2">{product.price}</p>
        <p className="text-center text-gray-500 mb-2">This is a beautiful product that will enhance your room. (Sample description)</p>
        {product.buyLink && product.buyLink !== '#' && (
          <a href={product.buyLink} target="_blank" rel="noopener noreferrer" className="block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors mb-2">Buy Now</a>
        )}
      </div>
    </div>
  );
};

const DraggableProduct = ({ product, onViewDetails }) => {
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'product',
    item: { id: product.id, src: product.image, product: product },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isItemInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      ref={drag}
      className="product-card"
      title={product.name + ' - ' + product.price}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        className={`wishlist-heart ${isItemInWishlist(product.id) ? 'active' : ''}`}
        aria-label={isItemInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        title={isItemInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} fill={isItemInWishlist(product.id) ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          draggable={false}
        />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">{product.price}</div>
      </div>

      {/* Action Buttons */}
      <div className="product-actions">
        {product.buyLink && product.buyLink !== '#' && (
          <button
            onClick={(e) => { e.stopPropagation(); window.open(product.buyLink, '_blank', 'noopener,noreferrer'); }}
            className="buy-button"
          >
            Buy Now
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
          className="details-button"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const SidebarCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalProduct, setModalProduct] = useState(null);
  const categories = ['All', 'Furniture', 'WallDecor', 'AestheticElements'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="sidebar-catalog">
      {/* Header */}
      <div className="sidebar-header">
        <h3 className="sidebar-title">Furniture Catalog</h3>
        <div className="category-selector">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-dropdown"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'AestheticElements' ? 'Decor & Accents' : cat.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="products-container">
        {filteredProducts.map((product) => (
          <DraggableProduct key={product.id} product={product} onViewDetails={setModalProduct} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🗃️</div>
            <p className="empty-text">No items found</p>
            <p className="empty-subtext">Try selecting a different category</p>
          </div>
        )}
      </div>

      <ProductDetailsModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </div>
  );
};

export default SidebarCatalog; 