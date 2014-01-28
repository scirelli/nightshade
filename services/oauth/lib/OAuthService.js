var OAuth = require('oauth'),
    querystring = require('querystring');

/**
 * OAuthService Class Constructor
 * @param config {Object}
 * {
 *    TOKEN:            {String}
 *    TOKEN_SECRET:     {String}
 *    REQUEST_URL:      {String}
 *    ACCESS_URL:       {String}
 *    CONSUMER_KEY:     {String}
 *    CONSUMER_SECRET:  {String}
 * }
 */
function OAuthService(config) {

  if(!config 
      || !config.TOKEN || !config.TOKEN_SECRET
      || !config.CONSUMER_KEY || !config.CONSUMER_SECRET) {
    throw new Error('OAuthService requires config object with config.TOKEN and config.TOKEN_SECRET');
  }

  this.token = config.TOKEN;
  this.token_secret = config.TOKEN_SECRET;

  this.oauth = new OAuth.OAuth(
    config.REQUEST_URL || null,
    config.ACCESS_URL || null, 
    config.CONSUMER_KEY,
    config.CONSUMER_SECRET,
    config.VERSION || '1.0',
    null, // callback
    'HMAC-SHA1'
  );
}

OAuthService.prototype = {

  /**
   * get
   * @param path {String}
   * @param params {Object}
   * @param callback {Function}
   */
  get: function(path, params, callback) {
    path = path + '?' + querystring.stringify(params);

    return this.oauth.get(
      path,
      this.token,
      this.token_secret,
      function(err, data, res) {
        callback(err, data, res);
      }
    );
  }

};

module.exports = OAuthService;