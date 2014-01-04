module.exports = function(Yelp, Meetup) {

  function fetch(req, res) {
    console.log(req.params);
    Yelp.search(function(data) {
      res.send(200, data);
    });
  }

  return {
    fetch: fetch
  };
}