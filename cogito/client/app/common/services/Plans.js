angular.module('common.services.plans', [])
  .factory('Plans', function($http) {
    var _context = this;

    var plans = {};
    var _plans = false;

    var PLANS_REST_PATH = '/plans';

    function _handler(callback) {
      return function(data, status, headers, config) {
        var error = false;

        if(status !== 200) {
          error = true;
        }
        else {
          _plans = data;
        }

        callback.call(_context, error, _plans, status, headers, config);
      }
    };

    plans.fetch = function() {
      return $http.get(PLANS_REST_PATH);
    };

    plans.get = function(id) {
      var path = PLANS_REST_PATH + '/' + id;
      return $http.get(path);
    };

    plans.new = function(plan, callback) {
      if(typeof callback !== 'function') {
        throw 'new expects callback to be a function'
      } 

      $http.post(PLANS_REST_PATH, plan)
        .success(_handler(callback))
        .error(_handler(callback));
    };

    plans.update = function(id, key, value, plan) {
      var path = PLANS_REST_PATH + '/' + id,
          update = {};
         
      update[key] = value;

      $http.put(path, update);
    }
    
    return plans;
  });
