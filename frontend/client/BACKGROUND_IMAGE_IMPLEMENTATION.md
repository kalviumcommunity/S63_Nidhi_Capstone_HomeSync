# 🏠 Background Image Implementation Guide

## 📋 Overview
This document outlines the implementation of the background image upload and display functionality for the React-based interior design tool. The feature allows users to upload room photos and place furniture items on top of them.

## 🎯 Features Implemented

### ✅ 1. Background Image Upload
- **Component**: `UploadImage.jsx`
- **Functionality**: 
  - File input with drag-and-drop support
  - Image validation (accepts image/* files)
  - FileReader conversion to base64
  - Upload and remove buttons
  - Visual feedback for drag states

### ✅ 2. Canvas Background Display
- **Component**: `EnhancedCanvas.jsx` (enhanced) + `DesignCanvas.jsx` (new)
- **Functionality**:
  - Background image displayed as CSS background or dedicated layer
  - Proper aspect ratio handling with `background-size: cover`
  - Centered positioning with `background-position: center`
  - No-repeat to prevent tiling

### ✅ 3. Layered Rendering System
- **Layer 0**: Background image (z-index: 0)
- **Layer 5**: Grid overlay (z-index: 5)
- **Layer 10+**: Furniture items (z-index: 10+)
- **Layer 1000**: Moveable controls (z-index: 1000)

### ✅ 4. Drag & Drop Furniture
- **Preserved**: All existing drag-and-drop functionality
- **Enhanced**: Items appear above background with proper z-indexing
- **Features**: Draggable, resizable, rotatable furniture items

### ✅ 5. Bonus Features
- ✅ Remove Background button
- ✅ Drag-and-drop image upload
- ✅ Aspect ratio maintenance
- ✅ Visual feedback and notifications

## 🏗️ Component Architecture

```
📁 components/
├── 📄 UploadImage.jsx          # Image upload component
├── 📄 DesignCanvas.jsx         # New clean canvas implementation
├── 📄 EnhancedCanvas.jsx       # Enhanced existing canvas
├── 📄 DesignToolDemo.jsx       # Complete demo page
└── 📄 EnhancedRoomDesigner.jsx # Main designer (updated)
```

## 🔧 Key Components

### 1. UploadImage Component
```jsx
<UploadImage
  onImageUpload={handleBackgroundUpload}
  onImageRemove={handleRemoveBackground}
  hasBackground={!!backgroundImage}
/>
```

**Features**:
- File input with custom styling
- Drag-and-drop zone
- Image validation
- Upload/remove controls
- Responsive design

### 2. DesignCanvas Component
```jsx
<DesignCanvas
  items={items}
  backgroundImage={backgroundImage}
  onItemsChange={handleItemsChange}
  selectedItemId={selectedItemId}
  onSelectedItemChange={setSelectedItemId}
  snapToGrid={snapToGrid}
  gridSize={gridSize}
  showGrid={showGrid}
  canvasSize={{ width: 1000, height: 700 }}
/>
```

**Features**:
- Fixed canvas size (1000×700px)
- Background image layer
- Grid overlay
- Furniture item rendering
- Moveable integration
- Proper z-index layering

### 3. Enhanced Canvas Layering
```jsx
{/* Background Image Layer (z-index: 0) */}
{backgroundImage?.src && (
  <div className="background-image-layer" style={{
    backgroundImage: `url(${backgroundImage.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0
  }} />
)}

{/* Furniture Items (z-index: 10+) */}
{items.map((item) => (
  <div style={{ zIndex: Math.max(item.zIndex || 10, 10) }}>
    {/* Item content */}
  </div>
))}
```

## 🎨 Styling Implementation

### Canvas Styling
```css
.design-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border: 3px solid #e5e7eb;
  border-radius: 12px;
  background: white;
}

.design-canvas.has-background {
  background-color: transparent;
}

.background-image-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  pointer-events: none;
}
```

### Furniture Item Styling
```css
.furniture-item {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: all 0.2s;
  user-select: none;
  z-index: 10; /* Minimum z-index */
}

.furniture-item:hover {
  border-color: #93c5fd;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.furniture-item.selected {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}
```

## 🚀 Usage Examples

### Basic Implementation
```jsx
import React, { useState } from 'react';
import DesignCanvas from './components/DesignCanvas';
import UploadImage from './components/UploadImage';

const MyDesignTool = () => {
  const [items, setItems] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  return (
    <div>
      <UploadImage
        onImageUpload={setBackgroundImage}
        onImageRemove={() => setBackgroundImage(null)}
        hasBackground={!!backgroundImage}
      />
      
      <DesignCanvas
        items={items}
        backgroundImage={backgroundImage}
        onItemsChange={setItems}
        selectedItemId={selectedItemId}
        onSelectedItemChange={setSelectedItemId}
      />
    </div>
  );
};
```

### Integration with Existing Code
The implementation enhances the existing `EnhancedRoomDesigner` component:

1. **Added UploadImage component** to settings panel
2. **Enhanced background display** in EnhancedCanvas
3. **Improved z-index management** for proper layering
4. **Added remove background functionality**

## 🧪 Testing

### Demo Page
Visit `/design-tool-demo` to see the complete implementation:

**Features**:
- Background image upload with drag-and-drop
- Sample furniture catalog
- Canvas settings (grid, snap-to-grid)
- Real-time item management
- Clear canvas functionality

### Test Scenarios
1. **Upload background image** → Should display immediately
2. **Drag furniture items** → Should appear above background
3. **Move/resize/rotate items** → Should maintain layering
4. **Remove background** → Should clear background only
5. **Grid functionality** → Should work with/without background

## 🔍 Technical Details

### Image Processing
```javascript
const handleFileSelect = (file) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        id: 'background',
        src: e.target.result, // base64 data URL
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      onImageUpload(imageData);
    };
    reader.readAsDataURL(file);
  }
};
```

### Z-Index Management
```javascript
// Ensure furniture items always appear above background
const zIndex = Math.max(item.zIndex || 10, 10);

// When dropping new items
const newItem = {
  // ... other properties
  zIndex: Math.max(...items.map(item => item.zIndex || 10), 10) + 1
};

// Bring to front functionality
const maxZIndex = Math.max(...items.map(item => item.zIndex || 10), 10);
handleItemUpdate(itemId, { zIndex: maxZIndex + 1 });
```

### Canvas Sizing
```javascript
const canvasSize = { width: 1000, height: 700 }; // Fixed size
// Or dynamic sizing:
const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

useEffect(() => {
  const updateCanvasSize = () => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      const rect = container.getBoundingClientRect();
      setCanvasSize({
        width: Math.max(800, rect.width - 40),
        height: Math.max(600, rect.height - 40)
      });
    }
  };
  // ... resize listener setup
}, []);
```

## 🐛 Troubleshooting

### Common Issues

1. **Background not displaying**
   - Check if `backgroundImage.src` contains valid base64 data
   - Verify CSS `background-image` property is applied
   - Ensure no conflicting CSS `background` shorthand

2. **Items appearing behind background**
   - Verify z-index values (items should be ≥ 10)
   - Check CSS positioning (items need `position: absolute`)
   - Ensure background layer has `z-index: 0`

3. **Drag-and-drop not working**
   - Verify DndProvider wraps the components
   - Check dataTransfer.setData/getData implementation
   - Ensure drop handlers prevent default behavior

### Debug Tips
```javascript
// Add console logs to track state
useEffect(() => {
  console.log('Background image:', backgroundImage);
  console.log('Items:', items);
  console.log('Selected item:', selectedItemId);
}, [backgroundImage, items, selectedItemId]);
```

## 📱 Responsive Design

The implementation includes responsive breakpoints:

```css
@media (max-width: 1200px) {
  .design-canvas-container {
    padding: 10px;
  }
  
  .canvas-wrapper {
    max-width: 100%;
    max-height: 100%;
  }
}

@media (max-width: 768px) {
  .demo-controls {
    grid-template-columns: 1fr;
  }
  
  .canvas-header {
    flex-direction: column;
  }
}
```

## 🎉 Conclusion

The background image functionality has been successfully implemented with:

✅ **Clean modular components**  
✅ **Proper layering system**  
✅ **Preserved existing functionality**  
✅ **Enhanced user experience**  
✅ **Responsive design**  
✅ **Comprehensive testing**  

The implementation follows React best practices and maintains compatibility with the existing codebase while adding powerful new functionality for interior design visualization.