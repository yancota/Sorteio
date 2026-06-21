const mockQuery = jest.fn();
const mockConnect = jest.fn().mockResolvedValue({
  query: mockQuery,
  release: jest.fn()
});
const mockEnd = jest.fn().mockResolvedValue();

class Pool {
  constructor(config) {
    this.config = config;
  }
  query(...args) {
    return mockQuery(...args);
  }
  connect() {
    return mockConnect();
  }
  end() {
    return mockEnd();
  }
}

module.exports = {
  Pool,
  _mockQuery: mockQuery,
  _mockConnect: mockConnect,
  _mockEnd: mockEnd
};
