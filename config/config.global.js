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
config.PATH.APP = __dirname + '/../app';

// client
config.PATH.PUBLIC = __dirname + '/../client';

// stylesheets/css
config.PATH.ASSETS = config.PATH.PUBLIC + '/assets';
config.PATH.CSS = config.PATH.ASSETS + '/css';
config.PATH.STYLESHEETS = config.PATH.APP + '/stylesheets';
