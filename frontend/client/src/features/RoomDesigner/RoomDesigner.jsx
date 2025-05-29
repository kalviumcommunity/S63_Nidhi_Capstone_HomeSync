import React, { useState, useCallback, useReducer, useEffect } from 'react';
import { produce } from 'immer';
import axios from 'axios';
import CanvasEditor from './CanvasEditor';
import SidebarCatalog from './SidebarCatalog';
import PropertiesPanel from './PropertiesPanel';
import TopBarControls from './TopBarControls';
import './RoomDesigner.css';

// History Reducer
const historyReducer = produce((draft, action) => {
  switch (action.type) {
    case 'SET_STATE':
      if (JSON.stringify(draft.present) !== JSON.stringify(action.payload)) {
        draft.past.push(draft.present);
        draft.present = action.payload;
        draft.future = [];
      }
      break;
    case 'UNDO':
      if (draft.past.length > 0) {
        draft.future.unshift(draft.present);
        draft.present = draft.past.pop();
      }
      break;
    case 'REDO':
      if (draft.future.length > 0) {
        draft.past.push(draft.present);
        draft.present = draft.future.shift();
      }
      break;
    case 'RESET_HISTORY':
        draft.past = [];
        draft.present = action.payload || { items: [], backgroundImage: null };
        draft.future = [];
        break;
  }
});

const RoomDesigner = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [stageRef, setStageRef] = useState(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [designName, setDesignName] = useState('');

  const [canvasState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: { items: [], backgroundImage: null },
    future: [],
  });

  // Load saved design from localStorage on component mount
  useEffect(() => {
    const savedDesign = localStorage.getItem('lastDesign');
    if (savedDesign) {
      try {
        const parsedDesign = JSON.parse(savedDesign);
        dispatch({ type: 'SET_STATE', payload: parsedDesign });
      } catch (error) {
        console.error('Error loading saved design:', error);
      }
    }
  }, []);

  // Save to localStorage whenever canvas state changes
  useEffect(() => {
    localStorage.setItem('lastDesign', JSON.stringify(canvasState.present));
  }, [canvasState.present]);

  const { items, backgroundImage } = canvasState.present;

  const setState = useCallback((newState) => {
    dispatch({ type: 'SET_STATE', payload: newState });
  }, [dispatch]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  const updateCanvasState = useCallback((newItems, newBackgroundImage) => {
    const newPresent = { 
        items: newItems !== undefined ? newItems : items, 
        backgroundImage: newBackgroundImage !== undefined ? newBackgroundImage : backgroundImage 
    };
    if (JSON.stringify(newPresent) !== JSON.stringify(canvasState.present)) {
        setState(newPresent);
    }
  }, [items, backgroundImage, setState, canvasState.present]);

  const handleDeleteSelectedItem = useCallback(() => {
    if (selectedItemId) {
      const newItems = items.filter(item => item.id !== selectedItemId);
      updateCanvasState(newItems, backgroundImage);
      setSelectedItemId(null);
    }
  }, [selectedItemId, items, backgroundImage, updateCanvasState]);

  const handleSave = async () => {
    if (!designName.trim()) {
      setSaveError('Please enter a design name');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const designData = {
        name: designName,
        items: canvasState.present.items,
        backgroundImage: canvasState.present.backgroundImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to MongoDB
      const response = await axios.post('/api/designs', designData);
      
      if (response.data) {
        // Clear error and show success message
        setSaveError(null);
        alert('Design saved successfully!');
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Error saving design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDesign = async (designId) => {
    try {
      const response = await axios.get(`/api/designs/${designId}`);
      if (response.data) {
        dispatch({ type: 'SET_STATE', payload: response.data });
        setDesignName(response.data.name);
      }
    } catch (error) {
      setSaveError('Error loading design');
    }
  };

  const handleExportImage = () => {
    if (stageRef && stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${designName || 'homesync-design'}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(canvasState.present, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${designName || 'homesync-design'}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleSnap = (isChecked) => {
    setSnapToGrid(isChecked);
  };

  const selectedItemDetails = items.find(item => item.id === selectedItemId);

  return (
    <div className="room-designer-layout">
      <TopBarControls 
        onDeleteSelected={handleDeleteSelectedItem}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onExportImage={handleExportImage}
        onExportJSON={handleExportJSON}
        onToggleSnap={handleToggleSnap}
        canUndo={canvasState.past.length > 0}
        canRedo={canvasState.future.length > 0}
      />
      
      <div className="save-design-section">
        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder="Enter design name"
          style={{ marginRight: '10px' }}
        />
        <button 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Design'}
        </button>
        {saveError && (
          <div style={{ color: 'red', marginTop: '5px' }}>
            {saveError}
          </div>
        )}
      </div>

      <div className="main-content">
        <SidebarCatalog />
        <CanvasEditor 
          items={items}
          backgroundImage={backgroundImage}
          updateCanvasState={updateCanvasState}
          selectedItemId={selectedItemId} 
          setSelectedItemId={setSelectedItemId}
          setStageRef={setStageRef}
          snapToGrid={snapToGrid}
        />
        <PropertiesPanel 
          selectedItem={selectedItemDetails} 
          updateCanvasState={updateCanvasState} 
          allItems={items}
        />
      </div>
    </div>
  );
};

export default RoomDesigner; 