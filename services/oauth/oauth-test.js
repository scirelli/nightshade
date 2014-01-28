var OAuthService = require('./index.js');
var YelpTestConfig = require('../yelp/lib/config.js');

exports["Class Constructor"] = {

    "requires object with OAuth configuration": function(test) {
        test.throws(function() { 
            var oauth = new OAuthService(); 
        }, Error, "required parameter not provided");

        test.throws(function() {
            var oauth = new OAuthService({});
        }, Error, "empty object provided");

        test.throws(function() {
            var oauth = new OAuthService({test: 'test'});
        }, Error, "incorrect key value provided");

        test.ok(new OAuthService(YelpTestConfig), 'Supplied valid config object');

        test.done();
    },
};

exports["get method"] = {
    
    "executes callback": function(test) {
        var oauth = new OAuthService(YelpTestConfig);

        oauth.get(YelpTestConfig.SEARCH_API_PATH, { }, function(err, data, res) {
            test.ok(data, "callback should alwas execute");
            test.done();
        });
    }
}


