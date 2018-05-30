const express = require('express');
const bodyParser = require('body-parser');

const objectRouter = require('./routers/objectRouter');

const app = express();

app.use(bodyParser.json());
app.use('/object', objectRouter);
app.use((err, req, res, next) => {
    res.status(404).json({'error': err.message});
});

const port = process.env.PORT || 5656;

app.listen(port, () => {
    console.log(`Listening at ${port}`);
});

module.export = app;

