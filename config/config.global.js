var config = module.exports = {};

config.YELP = {
  CONSUMER_KEY: 'PXGP2KNzL7qxRogSiBPLjQ',
  CONSUMER_SECRET: 'A05nrkWTTPIK0VQtu79xaqP-KGw',
  TOKEN: 'uwPQ3Hzcxc7YrMHr--00R3NKkD9cjtBi',
  TOKEN_SECRET: '4e3ldxUIjeSpHYhkgeBoG2VtRVo',

  SEARCH_API_PATH: 'http://api.yelp.com/v2/search'
};

config.GOOGLE_GEOCODER = {
  HOST: 'maps.googleapis.com',
  PATH: '/maps/api/geocode/json?',
  PORT: 80,
  METHOD: 'GET'
};

// paths
config.PATH = {};

// server app
config.PATH.APP = __dirname + '/../';
config.PATH.SERVICES = config.PATH.APP + '/services/';
config.PATH.DATASOURCES = config.PATH.SERVICES + '/datasources/';

config.PATH.LIB = __dirname + '/../lib/';
config.PATH.INTERFACES = config.PATH.LIB + '/interfaces/';
config.PATH.SERVICE_INTERFACES = config.PATH.INTERFACES + '/services/';

// client
config.PATH.PUBLIC = __dirname + '/../client/';

// stylesheets/css
config.PATH.ASSETS = config.PATH.PUBLIC + '/assets/';
config.PATH.CSS = config.PATH.ASSETS + '/css/';
config.PATH.STYLESHEETS = config.PATH.APP + '/stylesheets/';
