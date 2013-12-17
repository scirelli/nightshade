module.exports = function(OAuth, YelpConfig) {

  function search(callback) {
    OAuth.client(YelpConfig);

    var params = {
      term: 'food',
      location: 'Washington DC',
      // category_filter: 'active',
      deals_filter: true
    };

    OAuth.get('http://api.yelp.com/v2/search', params, function(err, data, res) {
      // console.log(err);
      console.log(data);
      // console.log(res);
      callback(data);
    });
  }

  return {
    search: search
  };

}