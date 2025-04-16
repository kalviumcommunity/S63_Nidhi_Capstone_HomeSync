const express = require('express');
const { User } = require('../models/User.js');
const { Item } = require('../models/Item.js');

const router = express.Router();

// ✅ CREATE (POST): Create a new user
router.post('/', async (req, res) => {
  try {
    const { googleId, name, email, profileImage } = req.body;

    const existingUser = await User.findOne({ googleId });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User({ googleId, name, email, profileImage });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to create user', error: error.message });
  }
});

// ✅ READ (GET): Fetch all users with wishlist and purchases populated
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .populate('wishlist')
      .populate('purchases');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch users', error: error.message });
  }
});

// ✅ READ (GET): Fetch user by ID with wishlist and purchases populated
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('wishlist')
      .populate('purchases');

    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch user', error: error.message });
  }
});

// ✅ UPDATE (PUT): Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to update user', error: error.message });
  }
});

module.exports = router;
