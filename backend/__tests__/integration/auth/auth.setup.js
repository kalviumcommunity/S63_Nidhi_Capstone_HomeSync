const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const setupTestDB = async () => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    
    console.log('Connected to in-memory MongoDB server for auth tests');
    return mongoServer;
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
};

const teardownTestDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Disconnected from in-memory MongoDB server');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

const clearTestDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
};

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
};