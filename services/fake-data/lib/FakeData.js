var q = require('q');

var Shapes = require('../../../lib/shapes');
var FauxData = require('../../../lib/fauxdata');

function FakeData() {}

FakeData.prototype = {

  search: function(lat, lon) {
    var DEFAULT_RADIUS = 7603;
    var defer = q.defer();
    var circle = new Shapes.Circle(lat, lon, DEFAULT_RADIUS);
    var fauxdata = new FauxData();

    console.log(lat, lon);
    defer.resolve(fauxdata.rndCats(circle, 100));

    return defer.promise;
  }

}

module.exports = FakeData;