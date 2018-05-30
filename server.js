const mongoose = require('./mongoose');
mongoose.connect(process.env.MONGODB_URI);

const app = require('./app');
const port = process.env.PORT || 5656;
app.listen(port, () => {
    console.log(`Listening at ${port}`);
});

module.exports = app;