module.exports = TicketflyRoutes = function(config) {

  var TicketflyService = require(config.PATH.DATASOURCES + '/ticketfly/TicketflyService.js');
  var _ticketflyService = new TicketflyService(config);

  return {
    fetch: function(req, res) {
      var promise = _ticketflyService.search();

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