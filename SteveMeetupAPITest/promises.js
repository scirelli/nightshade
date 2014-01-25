var FS = require('fs');
var Q = require('q');
var qhttp = require('q-io/http');

/*
var promise = Q.fcall(function(){
    'use strict';
    return 10;
});

promise.then(function(n){
    'use strict';
    console.log(n);
}).done();

function eventualAdd(a, b) {
    'use strict';
    return Q.spread([a, b], function (a, b) {
        return a + b;
    });
}

Q.fcall( eventualAdd, 2, 2 ).then(function(v){
    'use strict';
    console.log(v);
});
console.log(Q.fcall( eventualAdd, 2, 2 ).get());

function delay(ms) {
    'use strict';
    var deferred = Q.defer();
    setTimeout(deferred.resolve, ms);
    return deferred.promise;
}

//Returning something that's not a promise fires off the thens right away
delay(100).then( function(){
    'use strict';
    console.log(1);
    delay(500).then(function(){console.log(2);});
    return 1;
}).then(function(n){
    'use strict';
    console.log('rnt ' + n);
    delay(500).then(function(){console.log(3);});
    return 2;
}).then(function(n){
    'use strict';
    console.log('rnt ' + n);
    delay(500).then(function(){console.log(4);});
    return 3;
});

//Returning promises chains them
delay(1000).then( function(){
    'use strict';
    console.log('---------------- Chaining ---------------------');
    console.log(1);
    return delay(500).then(function(){console.log(2); return 'rtn 1';});
}).then(function(n){
    'use strict';
    console.log('rnt ' + n);
    return delay(500).then(function(){console.log(3); return 'rtn 2';});
}).then(function(n){
    'use strict';
    console.log('rnt ' + n);
    return delay(500).then(function(){console.log(4); return 'rtn 4';});
});


var promises = Q.all([
    Q.fcall(function(){ console.log('all 1'); return 1;}),
    Q.fcall(function(){ console.log('all 2'); return 2;}),
    Q.fcall(function(){ console.log('all 3'); return 3;})
]);
Q.allSettled(promises).then(function(results){
    console.log(results);
});
*/
//======================= Promises ==========================================================================
/*
var oneA = function () {
    var d = Q.defer();
        var timeUntilResolve = Math.floor((Math.random()*2000)+1);
    console.log('1A Starting');
    setTimeout(function () {
                console.log('1A Finished');
                d.resolve('1ATime: ' + timeUntilResolve);
    }, timeUntilResolve);
    return d.promise;
};

var oneB = function () {
        var d = Q.defer();
        var timeUntilResolve = Math.floor((Math.random()*2000)+1);
        console.log('1B Starting');
        setTimeout(function () {
                console.log('1B Finished');
                d.resolve('1BTime: ' + timeUntilResolve);
    }, timeUntilResolve);
        return d.promise;
};

// This fuction throws an error which later on we show will be handled
var two = function (oneATime, oneBTime) {
        var d = Q.defer();
        console.log('OneA: ' + oneATime.value + ', OneB: ' + oneBTime.value);
        console.log('2 Starting and Finishing, so 3A and 3B should start');
        d.resolve();
        return d.promise;
};

var threeA = function () {
    var d = Q.defer();
    console.log('3A Starting');
    setTimeout(function () {
                console.log('3A Finished');
                d.resolve();
    }, Math.floor((Math.random()*2000)+1));
    return d.promise;
};

var threeB = function () {
    var d = Q.defer();
    console.log('3B Starting');
    setTimeout(function () {
                console.log('3B Finished');
                d.resolve();
    }, Math.floor((Math.random()*5000)+1));
    return d.promise;
};

var four = function () {
        console.log('Four is now done');
};

Q.allSettled([ oneA(), oneB() ])
.spread(two)
.then(function () { return Q.all([ threeA(), threeB() ]); })
.then(four)
.done();
*/

//======================= HTTP ==========================================================================
var APIKey = "3924447020474677a2469686d4f2f3c";//Steve's key
var sURL2 = "http://api.meetup.com/groups.json/?zip=11211&topic=moms&order=members&key=3924447020474677a2469686d4f2f3c&page=10&offset=0";
var sURL = "http://api.meetup.com/2/categories?order=shortname&desc=false&offset=0&format=json&page=20&sig_id=14654395&sig=bb0d509dd82a1d6729842647884b27d5fac98ae8";
var p = qhttp.request(sURL2);
p.then(
    function( response ){
        'use strict';
        debugger;

        response.body.read().then(function(buf){
            debugger;
            console.log( JSON.parse(buf.toString()) );
        },function(a,b,c){
            debugger;
        });
        /*
        response.body.forEach(function(a){
            debugger;
        });
        */
    },
    function(a,b,c){
        'use strict';
        debugger;
    }
);
