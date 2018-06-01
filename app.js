const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');

const objectRouter = require('./routers/objectRouter');

const app = express();

app.use(bodyParser.json());
app.use('/object', objectRouter);
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(404).json({'error': err.message});
});

module.exports = app;

