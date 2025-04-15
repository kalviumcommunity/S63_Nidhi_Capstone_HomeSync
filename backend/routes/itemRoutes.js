const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// ✅ CREATE (POST): Add a new item
router.post('/', async (req, res) => {
  try {
    const { name, image, price, description } = req.body;
    const newItem = new Item({ name, image, price, description });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to create item', error: error.message });
  }
});

// ✅ READ (GET): Fetch all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
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
