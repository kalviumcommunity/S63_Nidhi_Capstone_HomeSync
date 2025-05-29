import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer, Line, Group, Circle, Text } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import useImage from 'use-image';
import ImageUploader from './ImageUploader';
import { motion } from 'framer-motion';
import './RoomDesignerModern.css';

const DraggableItem = ({ item, onSelect, isSelected, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image, imageStatus] = useImage(item.itemSrc, 'anonymous');

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const commonProps = {
    id: item.id,
    x: item.x,
    y: item.y,
    rotation: item.rotation || 0,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e) => {
      onChange({
        ...item,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e) => {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      onChange({
        ...item,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    },
  };

  return (
    <>
      {item.itemSrc && image ? (
        <KonvaImage
          ref={shapeRef}
          image={image}
          width={item.width}
          height={item.height}
          {...commonProps}
        />
      ) : (
        <Rect
          ref={shapeRef}
          width={item.width}
          height={item.height}
          fill={item.fill || '#A0D2DB'}
          {...commonProps}
        />
      )}
      {isSelected && (
        <>
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          {/* Delete button */}
          <Group
            x={item.x + item.width}
            y={item.y - 20}
            onClick={(e) => {
              e.cancelBubble = true;
              onChange({ ...item, isDeleted: true });
            }}
          >
            <Circle
              radius={10}
              fill="#ff4444"
              stroke="#fff"
              strokeWidth={2}
            />
            <Text
              text="×"
              fontSize={16}
              fill="#fff"
              align="center"
              verticalAlign="middle"
              width={20}
              height={20}
              offsetX={10}
              offsetY={10}
            />
          </Group>
        </>
      )}
    </>
  );
};

const CanvasEditor = ({ 
  items, 
  backgroundImage: bgImageFromProps, // Renamed to avoid conflict with internal state name if any
  updateCanvasState, 
  selectedItemId, 
  setSelectedItemId, 
  setStageRef: setParentStageRef,
  snapToGrid = true,
  gridSize = 20
}) => {
  // Internal state for background image loading, if needed for FileReader source
  // However, bgImageFromProps should ideally already contain the src for useImage
  const [bgImageKonva, bgLoadError] = useImage(bgImageFromProps?.src, 'anonymous');
  const [guidelines, setGuidelines] = useState([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    if (setParentStageRef) {
      setParentStageRef(stageRef);
    }
  }, [stageRef, setParentStageRef]);

  // Delete key press - now updates through RoomDesigner
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedItemId) {
        const newItems = items.filter(item => item.id !== selectedItemId);
        updateCanvasState(newItems, bgImageFromProps); // Update parent state
        setSelectedItemId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, items, bgImageFromProps, updateCanvasState, setSelectedItemId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newBg = {
          id: 'background',
          src: reader.result,
          x: 0,
          y: 0,
          // Actual width/height will be determined by useImage from the src
        };
        updateCanvasState(items, newBg); // Update parent state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    stageRef.current.setPointersPositions(e);
    const draggedItemData = e.dataTransfer.getData('application/json');
    let newItemData;

    if (draggedItemData) {
      const catalogItem = JSON.parse(draggedItemData);
      newItemData = {
        id: uuidv4(),
        x: stageRef.current.getPointerPosition().x - (catalogItem.defaultWidth || 100) / 2,
        y: stageRef.current.getPointerPosition().y - (catalogItem.defaultHeight || 100) / 2,
        width: catalogItem.defaultWidth || 100,
        height: catalogItem.defaultHeight || 100,
        draggable: true,
        catalogId: catalogItem.id,
        itemSrc: catalogItem.src,
        rotation: 0,
      };
    } else {
      // Fallback for non-catalog drops (e.g., if we were to allow dropping files directly)
      // For now this branch is less likely to be hit if only sidebar items are draggable
      newItemData = {
        id: uuidv4(),
        x: stageRef.current.getPointerPosition().x - 50,
        y: stageRef.current.getPointerPosition().y - 50,
        width: 100,
        height: 100,
        fill: '#89CFF0',
        draggable: true,
      };
    }

    if (newItemData) {
      updateCanvasState([...items, newItemData], bgImageFromProps); // Update parent state
    }
  };

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedItemId(null);
    }
  };
  
  const snapToGridPosition = (pos) => {
    if (!snapToGrid) return pos;
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  };

  const findGuidelines = (item) => {
    if (!snapToGrid) return [];
    const guidelines = [];
    const itemCenter = item.x + item.width / 2;
    const itemMiddle = item.y + item.height / 2;

    items.forEach(otherItem => {
      if (otherItem.id === item.id) return;

      // Vertical alignment
      if (Math.abs(itemCenter - (otherItem.x + otherItem.width / 2)) < 10) {
        guidelines.push({
          points: [itemCenter, 0, itemCenter, stageRef.current.height()],
          stroke: '#00ff00',
          dash: [5, 5]
        });
      }

      // Horizontal alignment
      if (Math.abs(itemMiddle - (otherItem.y + otherItem.height / 2)) < 10) {
        guidelines.push({
          points: [0, itemMiddle, stageRef.current.width(), itemMiddle],
          stroke: '#00ff00',
          dash: [5, 5]
        });
      }
    });

    return guidelines;
  };

  const handleItemChange = useCallback((changedItem) => {
    // If the item is marked for deletion, remove it
    if (changedItem.isDeleted) {
      const newItems = items.filter(item => item.id !== changedItem.id);
      updateCanvasState(newItems, bgImageFromProps);
      setSelectedItemId(null);
      return;
    }

    const snappedPos = snapToGridPosition({ x: changedItem.x, y: changedItem.y });
    const newItem = {
      ...changedItem,
      x: snappedPos.x,
      y: snappedPos.y
    };
    
    const newGuidelines = findGuidelines(newItem);
    setGuidelines(newGuidelines);

    const newItems = items.map(item => item.id === newItem.id ? newItem : item);
    updateCanvasState(newItems, bgImageFromProps);
  }, [items, bgImageFromProps, updateCanvasState, snapToGrid, gridSize]);

  // Determine actual width and height for background image once loaded
  const finalBgImageWidth = bgImageKonva ? bgImageKonva.width : (bgImageFromProps?.width || 0);
  const finalBgImageHeight = bgImageKonva ? bgImageKonva.height : (bgImageFromProps?.height || 0);

  const handleImageUpload = (uploadedImage) => {
    const newBg = {
      id: 'background',
      src: uploadedImage.src,
      x: 0,
      y: 0,
      width: uploadedImage.width,
      height: uploadedImage.height
    };
    updateCanvasState(items, newBg);
    setShowImageUploader(false);
  };

  return (
    <div className="room-designer-root">
      <div className="sidebar-modern">
        <h2>Categories</h2>
        <ul>
          <li>Furniture</li>
          <li>Wall Decor</li>
          <li>Showcase Items</li>
          <li>Aesthetic Elements</li>
        </ul>
      </div>
      <div className="room-canvas-modern">
        <div className="canvas-card">
          <div className="canvas-editor-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div className="canvas-controls">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowImageUploader(!showImageUploader)}
                style={{
                  padding: '8px 16px',
                  marginBottom: '10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showImageUploader ? 'Cancel Upload' : 'Upload Background'}
              </motion.button>
            </div>

            {showImageUploader && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ marginBottom: '20px' }}
              >
                <ImageUploader onImageUpload={handleImageUpload} />
              </motion.div>
            )}

            <Stage
              width={window.innerWidth * 0.6}
              height={window.innerHeight * 0.7}
              ref={stageRef}
              onClick={handleStageClick}
              onTap={handleStageClick}
              style={{ border: '1px solid #ccc' }}
            >
              <Layer>
                {/* Grid Lines */}
                {snapToGrid && Array.from({ length: Math.ceil(stageRef.current?.width() / gridSize) || 0 }).map((_, i) => (
                  <Line
                    key={`v${i}`}
                    points={[i * gridSize, 0, i * gridSize, stageRef.current?.height() || 0]}
                    stroke="#ddd"
                    strokeWidth={0.5}
                  />
                ))}
                {snapToGrid && Array.from({ length: Math.ceil(stageRef.current?.height() / gridSize) || 0 }).map((_, i) => (
                  <Line
                    key={`h${i}`}
                    points={[0, i * gridSize, stageRef.current?.width() || 0, i * gridSize]}
                    stroke="#ddd"
                    strokeWidth={0.5}
                  />
                ))}
                
                {/* Background Image */}
                {bgImageFromProps && bgImageFromProps.src && bgImageKonva && (
                  <KonvaImage
                    image={bgImageKonva}
                    x={bgImageFromProps.x}
                    y={bgImageFromProps.y}
                    width={finalBgImageWidth}
                    height={finalBgImageHeight}
                    listening={false}
                  />
                )}

                {/* Guidelines */}
                {guidelines.map((guide, i) => (
                  <Line
                    key={`guide${i}`}
                    points={guide.points}
                    stroke={guide.stroke}
                    dash={guide.dash}
                  />
                ))}

                {/* Items */}
                {items.map((item) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedItemId}
                    onSelect={() => setSelectedItemId(item.id)}
                    onChange={handleItemChange}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
          <div className="canvas-actions">
            <button>ADD FURNITURE</button>
            <button>ADD DECOR</button>
            <button>RESET</button>
          </div>
          <button className="wishlist-btn">Add to wishlist and buy</button>
        </div>
      </div>
      <div className="controls-modern">
        <h3>Item Editing</h3>
        <div className="slider-group">
          <label>Size</label>
          <input type="range" />
        </div>
        <div className="slider-group">
          <label>Position</label>
          <input type="range" />
        </div>
        <div className="slider-group">
          <label>Opacity</label>
          <input type="range" />
        </div>
        <button>Save Design</button>
      </div>
    </div>
  );
};

export default CanvasEditor; 