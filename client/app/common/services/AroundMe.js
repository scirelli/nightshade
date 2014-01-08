angular.module('common.services.aroundme', [])
  .factory('AroundMe', function($http) {
    var self = this;

    var AroundMe = {};
    var _aroundMe = false;
    var _currentLocation = false;

    var AROUND_ME_REST_PATH = '/yelp';

    function _translator(items) {
      var translated = [];
      items = items || [];

      items.forEach(function(item, index) {
        try{
          translated.push({
            name: item.name,
            description: item.deals[0].what_you_get || '',
            lat: item._location.lat,
            lon: item._location.lon
          });
        }
        catch(e) {
          console.log('error translating', e.toString());
        }
      }); 

      return translated;
    }

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
          _aroundMe = _translator(data);
          callback(_aroundMe, status, headers);
        })
        .error(function(data, status, headers) {
          callback(data, status, headers);
        });
      
    };

    return AroundMe;
  });
