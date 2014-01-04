module.exports = function(config, Plan, mongoose) {

  var crypto = require('crypto');

  var UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    password: { type: String, required: true },

    plans: [Plan._schema]
  });

  var User = mongoose.model('User', UserSchema);

  function changePassword() {}

  function forgotPassword() {}

  function get(id, callback) {
    User.findOne({_id: id}, function(err, user) {
      callback(err, user);
    });  
  };

  function login(credentials, callback) {
    var sha = crypto.createHash('sha256');
    sha.update(credentials.password);
    credentials.password = sha.digest('hex');

    User.findOne(credentials, function(err, doc) {
      callback(err, doc);   
    });
  }

  function register(user, callback) {
    var sha = crypto.createHash('sha256');
    sha.update(user.password);

    console.log('Registering ' + user.email);

    var _user = new User({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: 'admin',
      status: "pending",
      password: sha.digest('hex')
    });

    _user.save(function(err) {
      callback(err);
      registerCallback(err);
    });
  }

  function registerCallback(err) {
    if(err) {
      return console.log(err);
    } 
    return console.log('User was created');
  }

  return {
    get: get,
    changePassword: changePassword,
    forgotPassword: forgotPassword,
    login: login,
    register: register,
    registerCallback: registerCallback
  };
}