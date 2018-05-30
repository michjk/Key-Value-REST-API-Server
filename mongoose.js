const mongoose = require('mongoose');
const promise = require('bluebird');

mongoose.Promise = promise;

mongoose.connection.on('error', err => {
    console.error(err.message)
});
mongoose.connection.on("connected", () => {
    console.log("Connected to mongodb");
});
mongoose.connection.on("reconnected", () => {
    console.log("Reconnected to mongodb");
});
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected to mongodb");
});

module.exports = mongoose;