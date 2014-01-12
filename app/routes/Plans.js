/**
 * Plans Routes
 * @param Plan {Object}
 * {
 *   get: {Function},
 *   post: 
 *   create: {Function}
 * } 
 */
module.exports = function(User, Plan) {

  function get(req, res) {
    // User.get(req.session.user.id, function(err, user) {
    //   Plan.get(user, req.param('id', null), function(err, plans) {
    //     if(err) {
    //       res.send(500, err);
    //     }
    //     else {
    //       console.log('successfully fetched plans', plans);
    //       res.send(200, plans);
    //     }
    //   });
    // });

    
  }

  function post(req, res) {
    var plan = {
      name: req.param('name', null),
      description: req.param('description', null)
    };

    if(plan.name === null || plan.description === null) {
      res.send(500, 'plan requires name and description'); 
      return;
    }

    console.log(plan);

    User.get(req.session.user.id, function(err, user) {
      Plan.add(user, plan, function(err, plan) {
        if(err) {
          res.send(500, err);
        }
        else {
          res.send(200, plan);
        }
      });
    });

    
  }

  function put(req, res) {
    console.log(req); 
    res.send(200, 'testing put');
  }

  function remove(req, res) {
  }

  return {
    get: get,
    post: post,
    put: put,
    remove: remove
  }
}