module.exports = function(config, mongoose) {

  var crypto = require('crypto');

  var PlanSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    name: { type: String, default: '' },
    description: { type: String, required: true }
  });

  var Plan = mongoose.model('Plan', PlanSchema);

  function add(user, plan, callback) {
    console.log('add plan');

    // user not found
    if(user === null) { callback('User not found'); };

    user.plans.push(plan);

    user.save(function(err) {
      callback(err, plan);  
    });
  };

  function get(user, planId, callback) {
    var plans = this.fetch(user),
        match = false;

    if( !planId ) {
      callback(null, plans);
      return;
    }
    else {
      plans.forEach(function(plan, index) {
        console.log(plan, planId);
        if(plan._id === planId) {
          match = true;
          callback(null, plan);
          return;
        }
      }); 
    }

    if( !match ) {
      callback('not found');
    } 
  };

  function fetch(user) {
    return user.plans;
  };

  function update(plan, update, callback) {
    Plan.update(plan, { multi: false }, function(err, numberAffected, resp) {
      callback(err, resp);
    });
  };

  return {
    _schema: PlanSchema,
    add: add,
    get: get,
    fetch: fetch,
    update: update
  };
}