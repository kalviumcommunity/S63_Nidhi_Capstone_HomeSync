import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { products } from '../../data/dummyProducts';
import { useWishlist } from '../../context/WishlistContext';
import { Heart } from 'lucide-react';

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
      className="relative flex flex-col items-center group bg-white rounded shadow p-2 mb-2 w-24"
      title={product.name + ' - ' + product.price}
      style={{ opacity: isDragging ? 0.5 : 1, minHeight: 70 }}
    >
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-1 right-1 p-1 rounded-full z-20 shadow-md border border-white bg-white transition-colors ${
          isItemInWishlist(product.id) ? 'text-red-500 bg-red-100' : 'text-gray-400'
        } hover:text-red-500`}
        aria-label={isItemInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{ fontSize: 14 }}
        title={isItemInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={14} fill={isItemInWishlist(product.id) ? 'currentColor' : 'none'} />
      </button>
      <img
        src={product.image}
        alt={product.name}
        className="w-10 h-10 object-contain rounded hover:scale-110 transition-transform mb-1"
        draggable={false}
      />
      <span className="text-xs font-semibold text-gray-700 mb-1">{product.price}</span>
      {product.buyLink && product.buyLink !== '#' && (
        <button
          onClick={(e) => { e.stopPropagation(); window.open(product.buyLink, '_blank', 'noopener,noreferrer'); }}
          className="w-full bg-indigo-600 text-white text-xs py-1 rounded hover:bg-indigo-700 transition-colors mb-1 mt-1"
        >
          Buy Now
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
        className="text-xs text-indigo-600 hover:underline focus:outline-none"
      >
        View Details
      </button>
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
    <div style={{
      width: '100%',
      minWidth: 0,
      height: '100%',
      background: '#f9fafb',
      overflowY: 'auto',
      borderRight: 'none',
      boxShadow: 'none',
      padding: '4px'
    }}>
      <div className="mb-1">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'AestheticElements' ? 'Decor & Accents' : cat.replace(/([A-Z])/g, ' $1').trim()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 items-center">
        {filteredProducts.map((product) => (
          <DraggableProduct key={product.id} product={product} onViewDetails={setModalProduct} />
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-1 text-xs">No items in this category.</p>
        )}
      </div>
      <ProductDetailsModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </div>
  );
};

export default SidebarCatalog; 