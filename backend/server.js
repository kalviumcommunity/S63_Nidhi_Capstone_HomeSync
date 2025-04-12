const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const itemRoutes = require('./routes/itemRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('🌐 API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
