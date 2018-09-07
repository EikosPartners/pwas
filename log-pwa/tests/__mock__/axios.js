import { mockData } from "../unit/mockData.js";

module.exports = {
  get: jest.fn(() => Promise.resolve(mockData.data))
};
