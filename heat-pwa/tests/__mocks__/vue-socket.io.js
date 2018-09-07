module.exports = {
  $socket: {
    emit: jest.fn((type, payload) => payload)
  }
};
