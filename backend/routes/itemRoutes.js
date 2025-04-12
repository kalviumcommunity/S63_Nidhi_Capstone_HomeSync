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

module.exports = router;
