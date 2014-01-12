var express     = require('express'),
    app         = express(),
    http        = require('http'),
    fs          = require('fs'),
    uuid        = require('node-uuid'),
    cfg         = require('./config'),
    querystring = require('querystring'),
    oauth       = require('oauth'),
    proto       = require('prototype'),
    mongoose    = require('mongoose'),
    MemoryStore = require('connect').session.MemoryStore,
    db          = null,
    sass        = require('node-sass'),    
    Session     = require('connect').session,
    sessionStore = new MemoryStore();

Object.extend(global, proto); 

// interfaces
var INotications      = require(cfg.PATH.APP + '/services/interfaces/INotifications.js')(),
    OAuth             = require(cfg.PATH.APP + '/services/OAuth.js')(oauth, querystring),
    GoogleGeocoder    = require(cfg.PATH.APP + '/services/GoogleGeocoder')(http, querystring, cfg.GOOGLE_GEOCODER),
    Yelp              = require(cfg.PATH.APP + '/services/Yelp.js')(OAuth, GoogleGeocoder, cfg.YELP),
    LocationNotifiers = require(cfg.PATH.APP + '/services/LocationNotifiers.js')(INotications),
    LocationNotifier  = new LocationNotifiers();

var yelpListener = Class.create( INotications.IListener,{
  initialize:function(){},
  onChange:function( oLocationData ){
    console.log('something');
  }
});

LocationNotifier.register( new yelpListener() );

var Plan = require(cfg.PATH.APP + '/models/Plan.js')({}, mongoose);
var User = require(cfg.PATH.APP + '/models/User.js')({}, Plan, mongoose);

var server = http.createServer(app);
var port = cfg.PORT.HTTP;

var CogitoRoutes = require(cfg.PATH.APP + '/routes/Cogito.js')();
var UserRoutes = require(cfg.PATH.APP + '/routes/User.js')(User);
var PlansRoutes = require(cfg.PATH.APP + '/routes/Plans.js')(User, Plan);
var YelpRoutes = require(cfg.PATH.APP + '/routes/Yelp.js')(Yelp);
var AroundMeRoutes = require(cfg.PATH.APP + '/routes/AroundMe.js')(LocationNotifier);

app.configure(function() {
    'use strict';
    /* views */
    app.set('views', cfg.PATH.APP + '/views');
    app.set('view engine', 'jade');
    app.use(sass.middleware({
        src: cfg.PATH.STYLESHEETS,
        dest: cfg.PATH.CSS,
        prefix: '/assets/css',
        debug: true
    }));
    app.use(express.static(cfg.PATH.PUBLIC));

    /* limit data handled by server */
    app.use(express.limit('1mb'));

    /* parse post parameters */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: cfg.SESSION_SECRET, store: sessionStore
    }));
    mongoose.connect(cfg.MONGOOSE.MONGOHQ);
});

function auth(req, res, next) {
  if(!req.session.user || !req.session.user.loggedIn) {
    res.redirect('/welcome');
  }
  else {
    if(req.session.user.role === "admin") {
      req.session.user.isAdmin = true;
    }
    next();
  }
}

app.get('/', CogitoRoutes.index);
app.get('/mobile', CogitoRoutes.mobile);

app.post('/login', UserRoutes.login);
app.get('/logout', UserRoutes.logout);
app.post('/register', UserRoutes.register);
app.get('/welcome', UserRoutes.welcome);


app.get('/plans', PlansRoutes.get);
app.post('/plans', PlansRoutes.post);
app.put('/plans', PlansRoutes.put);

app.post('/yelp', YelpRoutes.fetch);
app.post('/aroundme', AroundMeRoutes.fetch);
app.get('/aroundme', AroundMeRoutes.fetch);

app.get('/geo', function(req, res) {
    GoogleGeocoder.query(function(err, data) {
        res.send(200, data);
    })
});

server.listen(port);
console.log('Listening on port: ', port);
