const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create an in-memory MongoDB server with specific options
    mongoServer = await MongoMemoryServer.create({
      binary: {
        downloadDir: './mongodb-binaries',
        skipMD5: true,
      },
      instance: {
        dbName: 'test-db',
      },
    });
    
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database with specific options
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    
    console.log('Connected to in-memory MongoDB server');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}, 120000); // 2 minutes timeout for initial setup

// Clean up after each test
afterEach(async () => {
  try {
    // Only clear collections if connected
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
});

// Clean up after all tests
afterAll(async () => {
  try {
    // Disconnect from MongoDB and stop the server
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
}, 30000); // 30 seconds timeout

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';