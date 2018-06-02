const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');

const objectRouter = require('./routers/objectRouter');

const app = express();

app.use(bodyParser.json());// accept body json format
app.use('/object', objectRouter);// set up router information
app.use((err, req, res, next) => { // callback on error
    logger.error(err);
    res.status(404).json({'error': err.message});
});

module.exports = app;

