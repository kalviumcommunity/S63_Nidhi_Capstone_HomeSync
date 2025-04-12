import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
