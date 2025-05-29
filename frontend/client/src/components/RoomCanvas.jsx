import React, { useRef, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import { useDrop } from 'react-dnd';
import useImage from 'use-image';
import DraggableItem from './DraggableItem';

const RoomCanvas = React.forwardRef(({
  roomImage,
  placedItems: items,
  onItemTransform,
  onItemSelect,
  onItemDelete,
  onDrop
}, ref) => {
  const [selectedId, setSelectedId] = useState(null);
  const [bgImage] = useImage(roomImage?.src || '', 'anonymous');

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    onItemSelect(id);
  }, [onItemSelect]);

  const handleChange = useCallback((id, newAttrs) => {
    onItemTransform(id, newAttrs);
  }, [onItemTransform]);

  const [, drop] = useDrop({
    accept: 'furniture',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const stage = ref.current;
      const point = stage.getPointerPosition();
      onDrop(item, point);
    },
  });

  return (
    <div 
      ref={drop}
      className={`relative w-full h-full bg-gray-50 rounded-lg shadow-lg p-4 transition-all duration-200`}
    >
      <Stage
        width={window.innerWidth * 0.7}
        height={window.innerHeight * 0.8}
        className="border border-gray-300 rounded-lg bg-white"
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) setSelectedId(null);
        }}
        ref={ref}
      >
        <Layer>
          {roomImage && bgImage && (
            <KonvaImage
              image={bgImage}
              x={0}
              y={0}
              width={roomImage.width}
              height={roomImage.height}
              listening={false}
            />
          )}
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={() => handleSelect(item.id)}
              onChange={handleChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});

export default RoomCanvas; 