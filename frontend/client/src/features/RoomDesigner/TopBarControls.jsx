import React from 'react';
const TopBarControls = ({ 
  onDeleteSelected, 
  onUndo, 
  onRedo, 
  onSave, 
  onExportImage, 
  onExportJSON, 
  onToggleSnap, 
  canUndo, 
  canRedo 
}) => {
  // This will later contain controls like Undo, Redo, Save, Export
  return (
    <div className="top-bar-controls">
      <button onClick={onUndo} disabled={!canUndo}>Undo (Ctrl+Z)</button>
      <button onClick={onRedo} disabled={!canRedo}>Redo (Ctrl+Shift+Z)</button>
      <button onClick={onDeleteSelected}>Delete Item</button>
      <button onClick={onSave}>Save Design</button>
      <button onClick={onExportImage}>Export as Image</button>
      <button onClick={onExportJSON}>Export as JSON</button>
      <label style={{marginLeft: '20px'}}>
        Snap to Grid: <input type="checkbox" onChange={(e) => onToggleSnap(e.target.checked)} />
      </label>
    </div>
  );
};

export default TopBarControls; 