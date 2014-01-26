var FS = require("q-io/fs"),
    p = null;

p = FS.read('config.json');

p.then(function(b){
    'use strict';
    debugger;
});

module.export = {};
