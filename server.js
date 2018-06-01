const logger = require('winston');
const mongoose = require('./mongoose');
mongoose.connect(process.env.MONGODB_URI);

const app = require('./app');

if (process.env.NODE_ENV === 'production') {
    const librato = require('./metrics/librato');
    app.use(librato.middleware());
    librato.start();
    logger.info('librato start');
}

const port = process.env.PORT || 5656;
app.listen(port, () => {
    logger.info(`Listening at ${port}`);
});

module.exports = app;