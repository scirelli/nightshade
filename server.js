// web server
var express     = require('express'),
    app         = express(),
    config      = require('./config');

Object.extend(global, proto); 

// Nightshade libs
var notications       = require('./lib/notification'),
    OAuth             = require('./services/OAuth.js')(oauth, querystring),
    GoogleGeocoder    = require('./services/GoogleGeocoder')(http, querystring, cfg.GOOGLE_GEOCODER),
    Yelp              = require('./services/Yelp.js')(OAuth, GoogleGeocoder, cfg.YELP),
    LocationNotifiers = require('./services/LocationNotifiers.js')(notications),
    LocationNotifier  = new LocationNotifiers();

var yelpListener = Class.create( notications.IListener,{
  initialize:function(){},
  onChange:function( oLocationData ){
    console.log('something');
  }
});

LocationNotifier.register( new yelpListener() );

var Plan = require('./models/Plan.js')({}, mongoose);
var User = require('./models/User.js')({}, Plan, mongoose);

var server = http.createServer(app);
var port = config.PORT.HTTP;

var CogitoRoutes = require(config.PATH.APP + '/routes/Cogito.js')();
var YelpRoutes = require(config.PATH.APP + '/routes/Yelp.js')(config);
var TicketflyRoutes = require(config.PATH.APP + '/routes/Ticketfly.js')(config);
var AroundMeRoutes = require(config.PATH.APP + '/routes/AroundMe.js')();

app.configure(function() {
    'use strict';
    /* views */
    app.set('views', config.PATH.APP + '/views');
    app.set('view engine', 'jade');
    app.use(sass.middleware({
        src: config.PATH.STYLESHEETS,
        dest: config.PATH.CSS,
        prefix: '/assets/css',
        debug: true
    }));
    app.use(express.static(config.PATH.PUBLIC));

    /* limit data handled by server */
    app.use(express.limit('1mb'));

    /* parse post parameters */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
});

app.get('/', CogitoRoutes.index);

app.post('/yelp', YelpRoutes.fetch);
app.get('/ticketfly', TicketflyRoutes.fetch);
app.post('/aroundme', AroundMeRoutes.fetch);

app.get('/geo', function(req, res) {
    GoogleGeocoder.query(function(err, data) {
        res.send(200, data);
    })
});

server.listen(port);
console.log('Listening on port: ', port);
