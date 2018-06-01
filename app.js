const express = require('express');
const bodyParser = require('body-parser');

const objectRouter = require('./routers/objectRouter');

const app = express();

if (process.env.NODE_ENV === 'production') {
    const librato = require('./librato');
    app.use(librato.middleware());
    librato.start();
}

app.use(bodyParser.json());
app.use('/object', objectRouter);
app.use((err, req, res, next) => {
    res.status(404).json({'error': err.message});
});

module.exports = app;

