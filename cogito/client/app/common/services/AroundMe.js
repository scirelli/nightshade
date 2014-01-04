angular.module('common.services.aroundme', [])
  .factory('AroundMe', function($http) {
    var self = this;

    var aroundMe = {};
    var _aroundMe = false;

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

    aroundMe.query= function(params) {
      params = params || {};
      var url = AROUND_ME_REST_PATH + '?' + jQuery.param(params);
      return $http.get(url);
    };
    
    return aroundMe;
  });
