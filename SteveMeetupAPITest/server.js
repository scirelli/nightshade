var express = require('express');
var redis   = require('redis');
var db      = redis.createClient();
var app     = express();

app.use(express.logger());

app.use(function( req, res, next ){
    'use strict';
   var ua = req.headers['user-agent'];
   console.log('Adding to db');
   db.zadd('online', Date.now(), ua, next);
});

app.use(function(req, res, next){
    'use strict';
    var min = 60 * 1000;
    var ago = Date.now() - min;
    console.log('Adding to db');
    db.zrevrangebyscore('online', '+inf', ago, function(err, users){
        //debugger;
        if(err){ return next(err); }
        req.online = users;
        next();
    });
});

app.use(express.errorHandler());

app.get('/hello.txt', function( req, res ){
    'use strict';
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
    //or
    //res.send(body);
});
/*
app.get('/', function( req, res, next ){
    'use strict';
    if( req.online ){
        res.send(req.online.length + ' users online');
    }else{
        res.send('online was undefined');
    }
});
*/ 

app.use( express.static(__dirname + '/public') );

app.listen(1337);
console.log('Listening on port 1337');
