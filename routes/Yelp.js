module.exports = function(Yelp, Meetup) {
    'use strict';
  function fetch(req, res) {
    var params = {
      lat: req.params.lat || req.body.lat,
      lon: req.params.lon || req.body.lon
    };

    if(!params.lat || !params.lon) {
      console.log('yelp fetch requires lat and lon parameters');
      res.send(500, 'yelp fetch requires lat and lon parameters');
      return;
    }

    Yelp.search(params, function(err, data) {
      if(err) {
        res.send(500, err);
        return
      }

      console.log('succesful yelp fetch', data);
      res.send(200, data);
      return;
    });
  }

  return {
    fetch: fetch
  };
}
