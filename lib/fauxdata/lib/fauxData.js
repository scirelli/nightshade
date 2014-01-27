var Q          = require("q"),
    FS         = require("q-io/fs"),
    o          = require('../../Math'),
    shapes     = require('../../shapes'),
    Categories = require('../../categories'),
    aWords     = require(__dirname + '/../data/brit-a-z.json');

function FauxData(){
    'use strict';
}

FauxData.prototype = {
    rndCats:function( shape, min, max ){
        'use strict';
        min = parseInt(min,10) || 0;
        max = parseInt(max,10) || 1000;
    }
};

module.exports = FauxData;
