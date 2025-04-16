import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: String,

    // Relationships with Item
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  },
  { timestamps: true }
);

// Export the User model
export const User = mongoose.model('User', userSchema);
