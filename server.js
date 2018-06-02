const logger = require('winston');

//initialize connection to mongodb
const mongoose = require('./db/mongoose');
mongoose.connect(process.env.MONGODB_URI);

const app = require('./app');

//set up metric analytics
if (process.env.NODE_ENV === 'production') {
    const librato = require('./metrics/librato');
    app.use(librato.middleware());// add request metrics on librato
    librato.start();
    logger.info('librato start');
}

//listen to default port
const port = process.env.PORT || 5656;
app.listen(port, () => {
    logger.info(`Listening at ${port}`);
});

module.exports = app;