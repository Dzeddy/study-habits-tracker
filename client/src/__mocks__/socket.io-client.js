// Mock implementation of socket.io-client
const mockSocket = {
  emit: jest.fn(),
  on: jest.fn(),
  disconnect: jest.fn()
};

// Mock io function that returns the mockSocket
const io = jest.fn(() => mockSocket);

// Export both the function and the mockSocket for test assertions
module.exports = io;
module.exports.mockSocket = mockSocket; 