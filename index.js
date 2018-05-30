const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const promise = require('bluebird');

const objectRouter = require('./routers/objectRouter');

mongoose.connect(process.env.MONGODB_URL);
mongoose.Promise = promise;
mongoose.connection.on('error', err => console.error(err.message));

const app = express();
const port = process.env.PORT || 5656;

app.use(bodyParser.json());
app.use('/object', objectRouter);
app.use((req, res, next) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

