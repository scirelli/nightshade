var OAuth = require('oauth'),
    querystring = require('querystring');

var _oauth,
    _token,
    _token_secret;

function OAuthService(config) {
  _token = config.TOKEN;
  _token_secret = config.TOKEN_SECRET;

  _oauth = new OAuth.OAuth(
    config.REQUEST_URL || null,
    config.ACCESS_URL || null, 
    config.CONSUMER_KEY || null,
    config.CONSUMER_SECRET || null,
    config.VERSION || '1.0',
    null, // callback
    'HMAC-SHA1'
  );
}

OAuthService.prototype = {

  get: function(path, params, callback) {
    path = path + '?' + querystring.stringify(params);

    console.log('oauth get', path);
    return _oauth.get(
      path,
      _token,
      _token_secret,
      function(err, data, res) {
        callback(err, data, res);
      }
    );
  }

};

module.exports = OAuthService;