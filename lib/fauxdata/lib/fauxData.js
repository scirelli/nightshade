var FS = require("q-io/fs"),
    o  = require('../Math');

function FauxData(){
    'use strict';
    var p = null;
    p = FS.read('lib/config.json');

    p.then(function( oBuf ){
            var config = JSON.parse( oBuf.toString() );
            debugger;
            console.log(config);
        },
        function(err){
            debugger;
        }
    );
}
module.exports = FauxData;
