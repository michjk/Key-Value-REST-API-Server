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
    expect(response.body.value).toBe(objectList[3].value);
  });
  test('GET request accept a key2 and return the latest value', async() => {
    const response = await request(app).get('/object/key2');
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(objectList[4].value);
  });
  test('GET request accept a key & timestamp and return the third value', async() => {
    const response = await request(app).get(`/object/key?timestamp=${objectList[2].timestamp.getTime()}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(objectList[2].value);
  });
  test('GET request accept a key & timestamp and return the second value', async() => {
    const response = await request(app).get(`/object/key?timestamp=${objectList[2].timestamp.getTime()-1}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(objectList[1].value);
  });
  test('GET request accept a key & timestamp before first value and return error', async() => {
    const response = await request(app).get('/object/key?timestamp=1000');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Value of key is not found!");
  });
  test('GET request accept an unknown key and return error', async() => {
    const response = await request(app).get('/object/key3');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Value of key3 is not found!");
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

describe('Route POST /object/ with JSON body', () => {
  let postReqAndCheckCorrect;
  let postReqAndCheckError;

  beforeAll(() => {
    postReqAndCheckCorrect = async(objectJSON) => {
      const response = await request(app).post('/object/').send(objectJSON);
      const [key, value] = Object.entries(objectJSON)[0];
      
      expect(response.status).toBe(200);
      expect(response.body.key).toBe(key);
      expect(response.body.value).toBe(value);
      expect(isNaN(response.body.timestamp)).toBe(false);

      return response;
    }

    postReqAndCheckError = async(objectJSON, errorMessage) => {
      const response = await request(app).post('/object/').send(objectJSON);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(errorMessage);
      
      return response;
    }
  })
  beforeEach(async() => {
    await mongoose.connect(process.env.MONGODB_URI);
    await ObjectModel.remove({});
  });
  afterEach(async() => {
    await mongoose.disconnect();
  });
  test('POST request: a key-value pair JSON is sent and stored', async() => {
    const objectJSON = {key: "1"}
    const response = await postReqAndCheckCorrect(objectJSON);
    const objectRes = await ObjectModel.findOne({key: "key"});
    expect(objectRes.value).toBe("1");
    expect(objectRes.timestamp.getTime()).toBe(response.body.timestamp);
  });
  test('POST request: 2 key-value pairs JSON are sent and stored by 2 POST request', async() => {
    const objectJSON1 = {key: "1"}
    const objectJSON2 = {key: "2"}
    const response1 = await postReqAndCheckCorrect(objectJSON1);
    const response2 = await postReqAndCheckCorrect(objectJSON2);
    
    const objectRes = await ObjectModel.find({key: 'key'}).sort({timestamp: -1});
    expect(objectRes[0].value).toBe('2');
    expect(objectRes[0].timestamp.getTime()).toBe(response2.body.timestamp);
    expect(objectRes[1].value).toBe('1');
    expect(objectRes[1].timestamp.getTime()).toBe(response1.body.timestamp);
  });
  test('POST request: empty body should return error', async() => {
    await postReqAndCheckError(null, "Body must contain JSON!");
    await postReqAndCheckError({}, "Body must contain JSON!");
  });
  test('POST request: empty value should return error', async() => {
    const objectJSON = {key: ''};
    const response = await postReqAndCheckError(objectJSON, "Value of key must be not empty!");
  });
  test('POST request: non-string value should return error', async() => {
    const objectJSON = {key: {key2: '2'}};
    const response = await postReqAndCheckError(objectJSON, "Value of key must be a string!");
  });
  test('POST request: only accept one key-value pair', async() => {
    const objectJSON = {key: 1, key2: 2};
    const response = await postReqAndCheckError(objectJSON, "Data must contains only one key-value pair!");
  });
});