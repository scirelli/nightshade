var config = require('./config.global');

config.HOST = process.env.IP || 'localhost/';

config.PORT = {};
config.PORT.HTTP = process.env.PORT || '1337';

module.exports = config;
