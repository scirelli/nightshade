module.exports = function(Yelp) {

  function get(req, res) {
    Yelp.search(function(data) {
      res.send(200, data);
    });

  }

  return {
    get: get
  };
}