import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RoomCanvas from './RoomCanvas';
import FurnitureCatalog from './FurnitureCatalog';
import furnitureCatalog from '../data/furnitureCatalog.json';
import useImage from 'use-image';

const RoomDesigner = () => {
  const [roomImage, setRoomImage] = useState(null);
  const [placedItems, setPlacedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const stageRef = useRef();
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          setRoomImage({
            src: e.target.result,
            width: img.width,
            height: img.height
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemTransform = useCallback((id, newAttrs) => {
    setPlacedItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...newAttrs } : item
      )
    );
  }, []);

  const handleItemSelect = useCallback((id) => {
    setSelectedItem(id);
  }, []);

  const handleItemDelete = useCallback((id) => {
    setPlacedItems((items) => items.filter((item) => item.id !== id));
    setSelectedItem(null);
  }, []);

  const handleDrop = useCallback((item, point) => {
    if (!point) return;

    // Load the furniture image
    const img = new window.Image();
    img.src = item.imageUrl;
    img.onload = () => {
      const newItem = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        x: point.x,
        y: point.y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        image: img,
      };
      setPlacedItems((items) => [...items, newItem]);
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save the design to your backend
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Design saved:', { roomImage, placedItems });
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    
    // Get the stage data URL
    const dataURL = stageRef.current.toDataURL();
    
    // Create a download link
    const link = document.createElement('a');
    link.download = 'room-design.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setPlacedItems([]);
    setSelectedItem(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 p-4">
          <div className="mb-4 space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50">
                <span className="mr-2">Upload Room Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSave}
                disabled={isSaving || !roomImage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Design'}
              </button>
              <button
                onClick={handleExport}
                disabled={!roomImage}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export
              </button>
              <button
                onClick={handleReset}
                disabled={placedItems.length === 0}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
            {roomImage && (
              <div className="text-sm text-gray-600">
                <p>• Click and drag items to move them</p>
                <p>• Use the handles to resize and rotate</p>
                <p>• Press Delete to remove selected items</p>
              </div>
            )}
          </div>
          {roomImage ? (
            <RoomCanvas
              ref={stageRef}
              roomImage={roomImage}
              placedItems={placedItems}
              onItemTransform={handleItemTransform}
              onItemSelect={handleItemSelect}
              onItemDelete={handleItemDelete}
              onDrop={handleDrop}
            />
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <p className="text-gray-500">Upload a room image to get started</p>
            </div>
          )}
        </div>
        <FurnitureCatalog
          items={furnitureCatalog.furniture}
        />
      </div>
    </DndProvider>
  );
};

export default RoomDesigner; 