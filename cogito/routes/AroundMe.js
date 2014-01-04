module.exports = function(LocationNotifiers) {

  function fetch(req, res) {
    var location = req.location; 

    LocationNotifiers.notify(location);
  }

  return {
    fetch: fetch
  };
}