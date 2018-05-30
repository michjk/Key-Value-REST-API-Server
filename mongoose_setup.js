const mongoose = require('mongoose');
const promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = promise;

mongoose.connection.on('error', err => {
    console.error(err.message)
});
mongoose.connection.on("connected", () => {
    console.log("Connected to mongodb");
});
mongoose.connection.on("reconnected", function() {
    console.log("Reconnected to mongodb");
});

module.export = mongoose;