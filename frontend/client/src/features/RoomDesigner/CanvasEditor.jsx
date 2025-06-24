import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import Moveable from 'react-moveable';
import { useWishlist } from '../../context/WishlistContext';
import { v4 as uuidv4 } from 'uuid';
import { Heart, Trash2 } from 'lucide-react';

const CanvasItem = ({ item, onSelect, isSelected, updateItem, deleteItem }) => {
  const { addToWishlist, isItemInWishlist } = useWishlist();
  const targetRef = useRef(null);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    addToWishlist(item.product);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteItem(item.instanceId);
  };

  const handleRotateClick = (e) => {
    e.stopPropagation();
    updateItem(item.instanceId, { rotate: (item.rotate + 15) % 360 });
  };

  return (
    <>
      <div
        ref={targetRef}
        className={`absolute cursor-grab transition-shadow duration-200 ${isSelected ? 'ring-2 ring-indigo-400 shadow-lg' : 'hover:ring-2 hover:ring-indigo-200'}`}
        style={{
          left: `${item.x}px`,
          top: `${item.y}px`,
          width: `${item.width}px`,
          height: `${item.height}px`,
          transform: `rotate(${item.rotate}deg)`,
        }}
        onClick={e => { e.stopPropagation(); onSelect(item.instanceId); }}
      >
        <img src={item.src} alt="item" className="w-full h-full" draggable="false" />
        {isSelected && (
          <>
            {/* Rotate Button */}
            <button
              onClick={handleRotateClick}
              className="absolute -top-4 -left-4 bg-white border border-gray-300 p-1 rounded-full shadow hover:bg-indigo-100 z-20"
              title="Rotate"
              style={{ cursor: 'pointer' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582M19.418 19A9 9 0 1 1 12 3v5"/></svg>
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              className="absolute -top-4 -right-4 bg-white border border-gray-300 p-1 rounded-full shadow hover:bg-red-100 z-20"
              title="Delete"
              style={{ cursor: 'pointer' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </>
        )}
      </div>

      {isSelected && targetRef.current && (
        <Moveable
          target={targetRef.current}
          draggable={true}
          resizable={true}
          rotatable={true}
          onDrag={({ target, left, top }) => {
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
          }}
          onResize={({ target, width, height }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={({ target }) => updateItem(item.instanceId, { x: parseInt(target.style.left), y: parseInt(target.style.top) })}
          onResizeEnd={({ target }) => updateItem(item.instanceId, { width: parseInt(target.style.width), height: parseInt(target.style.height) })}
          onRotateEnd={({ target }) => {
            const transform = target.style.transform;
            const rotation = transform.match(/rotate\(([^)]+)deg\)/);
            updateItem(item.instanceId, { rotate: rotation ? parseFloat(rotation[1]) : 0 });
          }}
          keepRatio={false}
          throttleDrag={0}
          throttleResize={0}
          throttleRotate={0}
          snappable={true}
          bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
        >
           <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={handleWishlistClick}
              className="bg-white p-1.5 rounded-full shadow-lg hover:bg-red-100 transition-colors"
              title="Add to Wishlist"
            >
              <Heart size={16} className="text-red-500" fill={isItemInWishlist(item.product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </Moveable>
      )}
    </>
  );
};


const CanvasEditor = ({ backgroundImage }) => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const dropRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'product',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropTargetBounds = dropRef.current.getBoundingClientRect();
      
      const x = offset.x - dropTargetBounds.left - 75; // Center the item on drop
      const y = offset.y - dropTargetBounds.top - 75;

      setItems((prevItems) => [
        ...prevItems,
        {
          ...item,
          instanceId: uuidv4(),
          x,
          y,
          width: 150,
          height: 150,
          rotate: 0,
        },
      ]);
    },
  });

  const updateItem = (id, newProps) => {
    setItems((prev) =>
      prev.map((item) => (item.instanceId === id ? { ...item, ...newProps } : item))
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.instanceId !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };
  
  const handleCanvasClick = (e) => {
    if (e.target === dropRef.current) {
        setSelectedItemId(null);
    }
  }

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      onClick={handleCanvasClick}
      className="relative w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto flex"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {items.map((item) => (
        <CanvasItem
          key={item.instanceId}
          item={item}
          isSelected={selectedItemId === item.instanceId}
          onSelect={setSelectedItemId}
          updateItem={updateItem}
          deleteItem={deleteItem}
        />
      ))}
    </div>
  );
};

export default CanvasEditor; 