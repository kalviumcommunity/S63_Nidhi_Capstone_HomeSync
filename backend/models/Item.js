const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  price: Number,
  description: String,
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
