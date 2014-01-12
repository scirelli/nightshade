var config = module.exports = {};

config.YELP = {
  CONSUMER_KEY: 'PXGP2KNzL7qxRogSiBPLjQ',
  CONSUMER_SECRET: 'A05nrkWTTPIK0VQtu79xaqP-KGw',
  TOKEN: 'uwPQ3Hzcxc7YrMHr--00R3NKkD9cjtBi',
  TOKEN_SECRET: '4e3ldxUIjeSpHYhkgeBoG2VtRVo'
}
// paths
config.PATH = {};

// server app
config.PATH.APP_PATH = __dirname + '/../app';

// client
config.PATH.PUBLIC = __dirname + '/../client';

// stylesheets/css
config.PATH.ASSETS = config.PATH.PUBLIC + '/assets';
config.PATH.CSS = config.PATH.ASSETS + '/css';
config.PATH.STYLESHEETS = config.PATH.APP_PATH + '/stylesheets';

