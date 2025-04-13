const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, image, price, description } = req.body;
    const newItem = new Item({ name, image, price, description });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
