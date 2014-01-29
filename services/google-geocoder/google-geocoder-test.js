var GoogleGeocder = require('./index.js');

exports["query method"] = {

  "returns promise": function(test) {
    var googleGeocoder = new GoogleGeocder();
    var promise = googleGeocoder.query();  
    test.equal(typeof promise.then, 'function', 'promise object should be returned');
    test.done();
  }
}

