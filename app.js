const express = require('express');
const bodyParser = require('body-parser');

const objectRouter = require('./routers/objectRouter');

const app = express();

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
    const librato = require('librato-node');
    librato.configure({email: process.env.LIBRATO_USER, token: process.env.LIBRATO_TOKEN});
    app.use(librato.middleware());
    
    librato.start();

    process.once('SIGINT', () => {
        librato.stop();
    });
    librato.on('error', (err) => {
        console.error(err);
    });
}

app.use(bodyParser.json());
app.use('/object', objectRouter);
app.use((err, req, res, next) => {
    res.status(404).json({'error': err.message});
});

module.exports = app;

