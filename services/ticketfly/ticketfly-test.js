var TicketflyService = require('./index.js');
var AppTestConfig = require("../../config");

exports["Constructor"] = {

    "requires object with Yelp configuration": function(test) {

        test.throws(function() { new TicketflyService(); }, Error, 'Constructor expects config.PATH.SERVICES');
        test.throws(function() { new TicketflyService({}); }, Error, 'Constructor expects config.PATH.SERVICES');
        test.ok(new TicketflyService(AppTestConfig), "Supplied valid config object");
        test.done();

    }
};

exports["search method"] = {

  "returns promise": function(test) {
    var ticketflyService = new TicketflyService(AppTestConfig);
    var promise = ticketflyService.search();  
    test.equal(typeof promise.then, 'function', 'promise object should be returned');
    test.done();
  }
}

