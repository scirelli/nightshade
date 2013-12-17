var config = require('./config.global');

config.HOST = 'localhost/';

config.PORT.HTTP = '8080'
config.PORT.HTTPS = '8443'

// paths
config.PUBLIC_PATH = __dirname + '/../../client';

//certs
config.CERTS = {};
config.CERTS.CERT_PATH = '/server/cert';
config.CERTS.KEY = config.CERT_PATH + 'server-key.pem';
config.CERTS.KEY = config.CERT_PATH + 'server-cert.pem';

// session
config.SESSION_SECRET = 'my private secret';

// mongoose
config.MONGOOSE = {};
config.MONGOOSE.PROTOCOL = 'mongodb://';
config.MONGOOSE.DB = 'cogito';
config.MONGOOSE.CONNECT = config.MONGOOSE.PROTOCOL + config.HOST + config.MONGOOSE.DB;

module.exports = config;