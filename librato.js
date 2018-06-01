const librato = require('librato-node');
librato.configure({email: process.env.LIBRATO_USER, token: process.env.LIBRATO_TOKEN});

process.once('SIGINT', () => {
    librato.stop();
});
librato.on('error', (err) => {
    console.error(err);
});

module.exports = librato;