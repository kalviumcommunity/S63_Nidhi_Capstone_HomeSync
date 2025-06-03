# HomeSync Backend Testing Guide

This document outlines the testing approach for the HomeSync backend API.

## Testing Structure

The tests are organized as follows:

```
backend/
├── __tests__/
│   ├── unit/                  # Unit tests
│   │   ├── models/            # Tests for database models
│   │   ├── controllers/       # Tests for controller functions
│   │   └── middleware/        # Tests for middleware functions
│   ├── integration/           # Integration tests
│   │   ├── auth/              # Tests for auth routes
│   │   ├── upload/            # Tests for upload routes
│   │   ├── wishlist/          # Tests for wishlist routes
│   │   └── user/              # Tests for user routes
│   ├── setup.js               # Test setup file
│   ├── testUtils.js           # Utility functions for tests
│   └── testApp.js             # Express app setup for tests
```

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Environment

The tests use:

- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **MongoDB Memory Server**: In-memory MongoDB for testing

## Testing Approach

### Unit Tests

Unit tests focus on testing individual components in isolation:

- **Models**: Test validation, methods, and hooks
- **Controllers**: Test business logic with mocked dependencies
- **Middleware**: Test authentication and error handling

### Integration Tests

Integration tests verify that components work together correctly:

- **API Routes**: Test HTTP endpoints with request/response cycles
- **Database Interactions**: Test actual database operations
- **Authentication Flow**: Test the complete auth flow

## Mocking Strategy

- **Database**: MongoDB Memory Server provides an in-memory database
- **Authentication**: JWT tokens are generated with a test secret
- **File Uploads**: File operations are mocked or use a temporary directory

## Test Data

Test data is created using utility functions in `testUtils.js`:

- `createTestUser()`: Creates a test user and returns the user object and token
- `authHeader()`: Generates authorization headers for authenticated requests

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Clean Up**: Clean the database between tests
3. **Descriptive Names**: Use descriptive test names that explain what is being tested
4. **Arrange-Act-Assert**: Structure tests with setup, action, and verification phases
5. **Error Cases**: Test both success and error scenarios