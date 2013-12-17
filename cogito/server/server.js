var express = require('express'),
    app = express(),
    https = require('https'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    cfg = require('./config');


var mongoose = require('mongoose'),
    MemoryStore = require('connect').session.MemoryStore,
    db;

var Session = require('connect').session,
    sessionStore = new MemoryStore;

var Plan = require('./models/Plan.js')({}, mongoose);
var User = require('./models/User.js')({}, Plan, mongoose);

var server = https.createServer({
  key: fs.readFileSync('certs/server-key.pem'),
  cert: fs.readFileSync('certs/server-cert.pem')
},app);

var CogitoRoutes = require('./routes/Cogito.js')();
var UserRoutes = require('./routes/User.js')(User);
var PlansRoutes = require('./routes/Plans.js')(User, Plan);

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
  mongoose.connect(cfg.MONGOOSE.CONNECT);
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

server.listen(cfg.PORT.HTTPS);
console.log('Listening on port: ', cfg.PORT.HTTPS);
