module.exports = function(User) {

  function login(req, res) {
    console.log('login request');

    var credentials = {
      email: req.param('email', null),
      password: req.param('password', null)
    };

    if(credentials.email === null || credentials.email.length < 1 || credentials.password === null || credentials.password.length < 1) {
      res.redirect('/login');
      return;
    }

    console.log(credentials);
    User.login(credentials, function(err, user) {
      if(err ) {
        console.log('server error during login', err, user);
        res.send(500, {redirect: '/welcome'});
      } 
      else if(user === null) {
        console.log('invalid credentials', err, user);
        res.send(401, {redirect: '/welcome'});
      }
      else {
        req.session.user = {};
        req.session.user.loggedIn = true;
        req.session.user.role = user.rolw
        req.session.user.id = user.id;
        res.send(200, {redirect: '/'});
      }
    });
  }

  function logout(req, res) {
    req.session.loggedIn = false;
    req.session.user = false;
    res.redirect('/');
  }

  function register(req, res) {
    var user = {
      email: req.param('email', null),
      firstname: req.param('firstname', null),
      lastname: req.param('lastname', null),
      role: req.param('role', null),
      password: req.param('password', null)
    };

    if(user.email === null || user.password === null) {
      res.send(400);
      return;
    }

    User.register(user, function(err) {
      if(err) {
        res.send(500, err);
      }
      else {
        res.redirect('/');
      }
    });
  }

  function welcome(req, res) {
    if(req.session.loggedIn) {
      res.redirect('/');
    }
    else {
      res.render('welcome.jade');
    } 
  }

  return {
    login: login,
    logout: logout,
    register: register,
    welcome: welcome
  };
}