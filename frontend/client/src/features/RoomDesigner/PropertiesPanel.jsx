import React, { useState, useEffect } from 'react';

const PropertiesPanel = ({ selectedItem, updateCanvasState, allItems }) => {
  // Use local state for input fields to allow editing before applying
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [rotation, setRotation] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  useEffect(() => {
    if (selectedItem) {
      setWidth(selectedItem.width?.toString() || '');
      setHeight(selectedItem.height?.toString() || '');
      setRotation(selectedItem.rotation?.toString() || '0');
      setX(selectedItem.x?.toString() || '');
      setY(selectedItem.y?.toString() || '');
    } else {
      setWidth('');
      setHeight('');
      setRotation('');
      setX('');
      setY('');
    }
  }, [selectedItem]);

  const handleApplyChanges = () => {
    if (!selectedItem) return;

    const updatedItem = {
      ...selectedItem,
      width: parseFloat(width) || selectedItem.width,
      height: parseFloat(height) || selectedItem.height,
      rotation: parseFloat(rotation) || selectedItem.rotation,
      x: parseFloat(x) || selectedItem.x,
      y: parseFloat(y) || selectedItem.y,
    };
    
    const newItems = allItems.map(item => item.id === selectedItem.id ? updatedItem : item);
    // Assuming updateCanvasState(newItems, currentBackground) is the way to update history
    // We need the current background image state. For now, we won't change it here.
    updateCanvasState(newItems, undefined); // undefined for background means no change
  };

  const handleZIndexChange = (direction) => {
    if (!selectedItem) return;
    let newItems = [...allItems];
    const currentIndex = newItems.findIndex(item => item.id === selectedItem.id);

    if (currentIndex === -1) return;

    // Remove the item and re-insert it at the new position
    const itemToMove = newItems.splice(currentIndex, 1)[0];

    if (direction === 'front') {
      newItems.push(itemToMove); // Add to the end (top)
    } else { // 'back'
      newItems.unshift(itemToMove); // Add to the beginning (bottom)
    }
    updateCanvasState(newItems, undefined);
  };

  if (!selectedItem) {
    return (
      <div className="properties-panel">
        <h4>Properties</h4>
        <p>No item selected.</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h4>Properties ({selectedItem.catalogId || 'Custom'})</h4>
      <div>
        <label>Width: </label>
        <input type="number" value={width} onChange={e => setWidth(e.target.value)} onBlur={handleApplyChanges} />
      </div>
      <div>
        <label>Height: </label>
        <input type="number" value={height} onChange={e => setHeight(e.target.value)} onBlur={handleApplyChanges} />
      </div>
      <div>
        <label>Rotation: </label>
        <input type="number" value={rotation} onChange={e => setRotation(e.target.value)} onBlur={handleApplyChanges} />
      </div>
      <div>
        <label>X: </label>
        <input type="number" value={x} onChange={e => setX(e.target.value)} onBlur={handleApplyChanges} />
      </div>
      <div>
        <label>Y: </label>
        <input type="number" value={y} onChange={e => setY(e.target.value)} onBlur={handleApplyChanges} />
      </div>
      {/* <button>Lock</button> // Placeholder */}
      <button onClick={() => handleZIndexChange('front')}>Bring to Front</button>
      <button onClick={() => handleZIndexChange('back')}>Send to Back</button>
      {/* Apply button is removed, changes apply onBlur or specific actions */}
    </div>
  );
};

export default PropertiesPanel; 