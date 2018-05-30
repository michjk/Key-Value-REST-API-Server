const request = require('supertest');

const mongoose = require('../mongoose');
const app = require('../app');
const ObjectModel = require('../models/object');

describe('GET /object/:key', () => {
  beforeEach(async() => {
    await mongoose.connect(process.env.MONGODB_URI);
    await ObjectModel.remove({});
    await ObjectModel.create({key: "key", value: "value"});
  });
  afterEach(async() => {
    await mongoose.disconnect();
  });
  test('should accept a key and return the latest value', async() => {
    const response = await request(app).get('/object/key');
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('value');
  });
});
