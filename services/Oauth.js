module.exports = function(OAuth, querystring) {

  var _oauth,
      _oauthToken,
      _oauthTokenSecret;


  function client(config) {
    _oauthToken = config.TOKEN;
    _oauthTokenSecret = config.TOKEN_SECRET

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

  function get(path, params, callback) {
    path = path + '?' + querystring.stringify(params);

    console.log('oauth get', path)
    return _oauth.get(
      path,
      _oauthToken,
      _oauthTokenSecret,
      function(err, data, res) {
        callback(err, data, res);
      }
    );
  }

  return {
    client: client,
    get: get
  };
  
}