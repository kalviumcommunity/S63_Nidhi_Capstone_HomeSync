const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId, productData } = req.body;
    
    const wishlistItem = new Wishlist({
      userId: req.user._id,
      productId,
      productData
    });

    const savedItem = await wishlistItem.save();
    
    // Emit WebSocket event for real-time updates
    if (req.io) {
      req.io.emit('wishlist:updated', {
        action: 'add',
        item: savedItem,
        userId: req.user._id
      });
    }
    
    res.status(201).json(savedItem);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Item already in wishlist' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Remove item from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const result = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      productId: req.params.productId
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    // Emit WebSocket event for real-time updates
    if (req.io) {
      req.io.emit('wishlist:updated', {
        action: 'remove',
        item: result,
        userId: req.user._id
      });
    }
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;