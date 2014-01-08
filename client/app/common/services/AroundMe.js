angular.module('common.services.aroundme', [])
  .factory('AroundMe', function($http) {
    var self = this;

    var AroundMe = {};
    var _aroundMe = false;
    var _currentLocation = false;

    var AROUND_ME_REST_PATH = '/yelp';

    function _handler(callback) {
      return function(data, status, headers, config) {
        var error = false;

        if(status !== 200) {
          error = true;
        }
        else {
          _aroundMe = data;
        }

        callback.call(self, error, _aroundMe, status, headers, config);
      }
    };

    AroundMe.query= function(currentLocation, callback) {
      currentLocation = currentLocation || {};

      if(_aroundMe && _currentLocation && _currentLocation.lat === currentLocation.lat && _currentLocation.lon === currentLocation.lon) {
        callback(_aroundMe, 200);
        return;
      }

      if(typeof callback !== 'function') {
        throw 'AroundMe.query() expects a callback function';
      }

      _currentLocation = currentLocation;
      $http.post(AROUND_ME_REST_PATH, currentLocation)
        .success(function(data, status, headers) {
          _aroundMe = data;
          callback(data, status, headers);
        })
        .error(function(data, status, headers) {
          callback(data, status, headers);
        });
      
    };

    return AroundMe;
  });
