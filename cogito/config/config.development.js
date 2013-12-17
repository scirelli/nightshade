var config = require('./config.global');

config.HOST = process.env.IP || 'localhost/';

config.PORT = {};
config.PORT.HTTP = process.env.PORT || '8080';
config.PORT.HTTPS = process.env.PORT || '8443';

// paths
config.PUBLIC_PATH = __dirname + '/../client';

// certs needed for https
config.CERTS = {};
config.CERTS.CERT_PATH = '/server/cert';
config.CERTS.KEY = config.CERT_PATH + 'server-key.pem';
config.CERTS.KEY = config.CERT_PATH + 'server-cert.pem';

// session
config.SESSION_SECRET = 'my private secret';

// mongoose
config.MONGOOSE = {};

// local mongo instance
config.MONGOOSE.PROTOCOL = 'mongodb://';
config.MONGOOSE.DB = 'cogito';
config.MONGOOSE.CONNECT = config.MONGOOSE.PROTOCOL + config.HOST + config.MONGOOSE.DB;

// mongohq cloud provider
config.MONGOOSE.MONGOHQ = "mongodb://seraphapp:seraphapppass@paulo.mongohq.com:10074/cogito";

module.exports = config;