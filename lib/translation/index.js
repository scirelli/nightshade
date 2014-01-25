//Attach all components
var translation = {};

translation.IGeoSpatialTranslator = require('./lib/IGeoSpatialTranslator.js');

var ns = require('./lib/ITranslate.js');
translation.ITranslate = ns.ITranslate;
translation.ATranslate = ns.ATranslate;

module.exports = translation;
