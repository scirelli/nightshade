module.exports = TicketflyRoutes = function(config) {

  var TicketflyService = require(config.PATH.SERVICES + 'ticketfly');
  var _ticketflyService = new TicketflyService(config);

  return {
    fetch: function(req, res) {
      var promise = _ticketflyService.search(38.92476163176131, -77.03218460083008);

      promise.then(function(data) {
        res.send(200, data);
      }, function(error) {
        res.send(500, error);
      }, function(notification) {
        console.log(notification);
      });
    }
  };
};