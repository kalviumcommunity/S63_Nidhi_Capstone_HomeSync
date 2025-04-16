const express = require('express');
const { Item } = require('../models/Item.js');
const { User } = require('../models/User.js');

const router = express.Router();

// ✅ CREATE (POST): Add a new item and link it to a user's wishlist
router.post('/', async (req, res) => {
  try {
    const { name, image, price, description, userId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    // Create and save new item
    const newItem = new Item({ name, image, price, description, user: userId });
    const savedItem = await newItem.save();

    // Link the item to the user's wishlist (change to purchases if needed)
    user.wishlist.push(savedItem._id);
    await user.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to create item', error: error.message });
  }
});

// ✅ READ (GET): Fetch all items (optionally with user info)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name email profileImage');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch items', error: error.message });
  }
});

// ✅ UPDATE (PUT): Update item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: '❌ Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to update item', error: error.message });
  }
});

module.exports = router;
