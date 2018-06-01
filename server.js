const mongoose = require('./mongoose');
mongoose.connect(process.env.MONGODB_URI);

const app = require('./app');

if (process.env.NODE_ENV === 'production') {
    const librato = require('./librato');
    app.use(librato.middleware());
    librato.start();
}

const port = process.env.PORT || 5656;
app.listen(port, () => {
    console.log(`Listening at ${port}`);
});

module.exports = app;