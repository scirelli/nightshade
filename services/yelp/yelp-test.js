var YelpService = require('./index.js');
var AppTestConfig = require("../../config");

exports["Constructor"] = {

    "requires object with Yelp configuration": function(test) {

        test.throws(function() { new YelpService(); }, Error, 'Constructor expects config.PATH.SERVICES');
        test.throws(function() { new YelpService({}); }, Error, 'Constructor expects config.PATH.SERVICES');
        test.ok(new YelpService(AppTestConfig), "Supplied valid config object");
        test.done();

    }
};

exports["search method"] = {

  "returns promise": function(test) {
    var yelpService = new YelpService(AppTestConfig);
    var promise = yelpService.search();  
    test.equal(typeof promise.then, 'function', 'promise object should be returned');
    test.done();
  }
}

