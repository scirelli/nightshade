angular.module('common.services.aroundme', [])
  .factory('AroundMe', function($http) {


    var AroundMe = {};
    AroundMe.MESSAGES = {
      FETCHING_DATA: 'Loading data...',
      SUCCESS: 'Successfuly retrieved data',
      ERROR: 'Failed to retrieve data'
    };

    var _aroundMe = {};
    var _currentLocation = false;

    var AROUND_ME_REST_PATH = '/yelp';

    function _translator(items) {
      var translated = [],
          deal;
      items = items || [];

      items.forEach(function(item, index) {
        try{
          translated.push(item);
        }
        catch(e) {
          console.log('error translating', e.toString());
        }
      }); 

      return translated;
    }

    AroundMe.query= function(currentLocation, callback) {
      currentLocation = currentLocation || {};

      if(!$.isEmptyObject(_aroundMe) && _currentLocation && _currentLocation.lat === currentLocation.lat && _currentLocation.lon === currentLocation.lon) {
        callback(_aroundMe, 200);
        return;
      }

      if(typeof callback !== 'function') {
        throw 'AroundMe.query() expects a callback function';
      }

      _currentLocation = currentLocation;
      $http.post(AROUND_ME_REST_PATH, currentLocation)
        .success(function(data, status, headers) {
          var _collection = [];  
          for(var category in data) {
            if(data.hasOwnProperty(category)) {
              _aroundMe[category] = data[category];
              _collection = _collection.concat(data[category]);
              _aroundMe.collection = _collection;
            }
          }
          _aroundMe.message = AroundMe.MESSAGES.SUCCESS;
          callback(_aroundMe, status, headers);
        })
        .error(function(data, status, headers) {
          data.message = AroundMe.MESSAGES.ERROR;
          callback(data, status, headers);
        });
      
    };

    return AroundMe;
  });
