var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    cfg = require('./config'),
    querystring = require('querystring'),
    oauth = require('oauth');

var mongoose = require('mongoose'),
    MemoryStore = require('connect').session.MemoryStore,
    db;

var Session = require('connect').session,
    sessionStore = new MemoryStore;

var OAuth = require('./services/OAuth.js')(oauth, querystring);
var GoogleGeocoder = require('./services/GoogleGeocoder')(http, querystring, cfg.GOOGLE_GEOCODER);
var Yelp = require('./services/Yelp.js')(OAuth, GoogleGeocoder, cfg.YELP);

var Plan = require('./models/Plan.js')({}, mongoose);
var User = require('./models/User.js')({}, Plan, mongoose);


// var server = https.createServer({
//   key: fs.readFileSync('certs/server-key.pem'),
//   cert: fs.readFileSync('certs/server-cert.pem')
// },app);

var server = http.createServer(app);
var port = cfg.PORT.HTTP;

var CogitoRoutes = require('./routes/Cogito.js')();
var UserRoutes = require('./routes/User.js')(User);
var PlansRoutes = require('./routes/Plans.js')(User, Plan);
var YelpRoutes = require('./routes/Yelp.js')(Yelp);

app.configure(function() {
  /* views */
  app.set('view engine', 'jade');
  app.use(express.static(cfg.PUBLIC_PATH));

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

app.get('/', auth, CogitoRoutes.index);
//app.get('/cogito', auth, CogitoRoutes.cogito);

app.post('/login', UserRoutes.login);
app.get('/logout', UserRoutes.logout);
app.post('/register', UserRoutes.register);
app.get('/welcome', UserRoutes.welcome);


app.get('/plans', PlansRoutes.get);
app.post('/plans', PlansRoutes.post);
app.put('/plans', PlansRoutes.put);

app.get('/yelp', YelpRoutes.get);

app.get('/geo', function(req, res) {
  GoogleGeocoder.query(function(err, data) {
    res.send(200, data);
  })
});

server.listen(port);
console.log('Listening on port: ', port);
