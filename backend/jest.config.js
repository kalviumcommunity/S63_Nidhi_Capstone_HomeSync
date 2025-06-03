module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  verbose: true,
  testTimeout: 60000, // 60 seconds timeout for all tests
  maxWorkers: 1, // Run tests serially to avoid MongoDB conflicts
  forceExit: true, // Force Jest to exit after tests complete
  detectOpenHandles: true, // Help detect memory leaks
};