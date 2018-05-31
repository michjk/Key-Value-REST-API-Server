const request = require('supertest');

const mongoose = require('../mongoose');
const app = require('../app');
const ObjectModel = require('../models/object');

describe('Route GET /object/:key', () => {
  let objectList = []
  beforeAll(async()=> {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await ObjectModel.remove({});
    objectList.push(await ObjectModel.create({key: "key", value: "1"}));
    objectList.push(await ObjectModel.create({key: "key", value: "2"}));
    objectList.push(await ObjectModel.create({key: "key", value: "3"}));
    objectList.push(await ObjectModel.create({key: "key", value: "4"}));
    objectList.push(await ObjectModel.create({key: "key2", value: "11"}));
    
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
    expect(response.body.value).toBe(objectList[3].key);
  });
  test('GET request accept a key2 and return the latest value', async() => {
    const response = await request(app).get('/object/key2');
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(objectList[4].key);
  });
  test('GET request accept a key & timestamp and return the third value', async() => {
    const response = await request(app).get(`/object/key?timestamp=${objectList[2].timestamp.getTime()}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(objectList[2].key);
  });
  test('GET request accept a key & timestamp and return the second value', async() => {
    const response = await request(app).get(`/object/key?timestamp=${objectList[2].timestamp.getTime()-1}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(objectList[1].key);
  });
  test('GET request accept a key & timestamp before first value and return error', async() => {
    const response = await request(app).get('/object/key?timestamp=1000');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Value of key is not found!");
  });
  test('GET request accept an unknown key and return error', async() => {
    const response = await request(app).get('/object/key3');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Value of key is not found!");
  });
  test('GET request accept a key & empty timestamp format and return error', async() => {
    const response = await request(app).get('/object/key?timestamp=');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Incorrect timestamp value!');
  });
  test('GET request accept an unknown key and return error', async() => {
    const response = await request(app).get(`/object/key?timestamp=sadasd`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Incorrect timestamp value!');
  });
});
