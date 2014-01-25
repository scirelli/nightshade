var config = module.exports = {};

// paths
config.PATH = {};

// server app
config.PATH.APP = __dirname + '/../';
config.PATH.SERVICES = config.PATH.APP + 'services/';
config.PATH.DATASOURCES = config.PATH.SERVICES + 'datasources/';

config.PATH.LIB = __dirname + '/../lib/';
config.PATH.INTERFACES = config.PATH.LIB + 'interfaces/';
config.PATH.SERVICE_INTERFACES = config.PATH.INTERFACES + 'services/';

// client
config.PATH.PUBLIC = __dirname + '/../client/';

// stylesheets/css
config.PATH.ASSETS = config.PATH.PUBLIC + 'assets/';
config.PATH.CSS = config.PATH.ASSETS + 'css/';
config.PATH.STYLESHEETS = config.PATH.APP + 'stylesheets/';
