import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import React, { useRef, useEffect } from "react";

const DraggableItem = ({ item, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(item.src);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <KonvaImage
        image={image}
        x={item.x}
        y={item.y}
        width={item.width || 100}
        height={item.height || 100}
        rotation={item.rotation || 0}
        draggable
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            const minSize = 20;
            const maxSize = 500;
            if (
              newBox.width < minSize ||
              newBox.height < minSize ||
              newBox.width > maxSize ||
              newBox.height > maxSize
            ) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={[
            'top-left', 'top-center', 'top-right',
            'middle-left', 'middle-right',
            'bottom-left', 'bottom-center', 'bottom-right'
          ]}
          rotateEnabled={true}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          rotationSnapTolerance={15}
          padding={5}
          borderStroke="#0096FF"
          borderStrokeWidth={2}
          anchorStroke="#0096FF"
          anchorFill="#FFFFFF"
          anchorSize={12}
          anchorCornerRadius={6}
          anchorStrokeWidth={2}
          keepRatio={false}
          centeredScaling={true}
          centeredRotation={true}
        />
      )}
    </>
  );
};

export default DraggableItem; 