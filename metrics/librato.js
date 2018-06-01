const librato = require('librato-node');
librato.configure({email: process.env.LIBRATO_USER, token: process.env.LIBRATO_TOKEN});

process.once('SIGINT', () => {
    logger.info('librato stop');
    librato.stop();
});
librato.on('error', (err) => {
    logger.error(err);
});

module.exports = librato;