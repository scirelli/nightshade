var FauxData = require('./lib/fauxData.js'),
    Shapes   = require('../shapes');
debugger;

var f = new FauxData();
var cats = f.rndCats( new Shapes.Circle(23.12345,40.567, 1603), 100 );
console.log(cats);
