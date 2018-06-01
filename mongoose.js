const logger = require('winston');
const mongoose = require('mongoose');
const promise = require('bluebird');

mongoose.Promise = promise;

mongoose.connection.on('error', err => {
    logger.error(err.message);
});
mongoose.connection.on("connected", () => {
    logger.info("Connected to mongodb");
});
mongoose.connection.on("reconnected", () => {
    logger.info("Reconnected to mongodb");
});
mongoose.connection.on("disconnected", () => {
    logger.info("Disconnected to mongodb");
});

module.exports = mongoose;