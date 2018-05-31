const request = require('supertest');

const mongoose = require('../mongoose');
const app = require('../app');
const ObjectModel = require('../models/object');

describe('GET request host/object/:key', () => {
  let objectList = []
  beforeAll(async()=> {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await ObjectModel.remove({});
    objectList.push(await ObjectModel.create({key: "key", value: "1"}));
    objectList.push(await ObjectModel.create({key: "key", value: "2"}));
    objectList.push(await ObjectModel.create({key: "key", value: "3"}));
    objectList.push(await ObjectModel.create({key: "key", value: "4"}));
    
    await mongoose.disconnect(process.env.MONGODB_URI);
  })
  beforeEach(async() => {
    await mongoose.connect(process.env.MONGODB_URI);
  });
  afterEach(async() => {
    await mongoose.disconnect();
  });
  test('GET request accept a key and return the latest value', async() => {
    const response = await request(app).get('/object/key');
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('4');
  });
  test('GET request accept a key and return the third value by using timestamp', async() => {
    const response = await request(app).get(`/object/key?timestamp=${objectList[2].timestamp.getTime()}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('3');
  });
});
