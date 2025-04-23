const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this path is correct

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
};

module.exports = {
  loginUser,
};
