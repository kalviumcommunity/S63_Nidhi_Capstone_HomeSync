import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
    price: Number,
    description: String,

    // Optional: reference to the user who added/owns this item
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Item = mongoose.model('Item', itemSchema);
