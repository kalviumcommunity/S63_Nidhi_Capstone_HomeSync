import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  price: Number,
  source: String, // Amazon, IKEA, etc.
  description: String,
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);
