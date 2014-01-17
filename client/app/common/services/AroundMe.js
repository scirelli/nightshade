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
          translated.push({
            name: item.title,
            description: item.description,
            url: item.external_link,
            lat: item.location.lat,
            lon: item.location.lon
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

          for(var category in data) {
            if(data.hasOwnProperty(category)) {
              _aroundMe[category] = _translator(data[category]);
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
