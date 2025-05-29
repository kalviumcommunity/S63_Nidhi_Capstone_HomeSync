import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const FurnitureItem = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    type: 'FURNITURE_ITEM',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <div
      ref={drag}
      className={`p-4 border rounded-lg cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:shadow-lg'
      } bg-white hover:border-blue-500`}
    >
      <div className="relative aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
          {item.category}
        </span>
        <button
          onClick={handleDetailsClick}
          className="text-xs text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>
      {showDetails && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>
          <a
            href={item.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 block mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            View Product Page →
          </a>
        </div>
      )}
    </div>
  );
};

const FurnitureCatalog = ({ items }) => {
  return (
    <div className="w-72 h-full bg-gray-50 p-4 overflow-y-auto border-l border-gray-200">
      <div className="sticky top-0 bg-gray-50 pb-4 z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Furniture Catalog</h2>
        <p className="text-sm text-gray-600">
          Drag items onto your room to place them
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <FurnitureItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default FurnitureCatalog; 