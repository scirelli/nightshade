angular.module('common.services.aroundme', [])
  .factory('AroundMe', function($http) {


    var AroundMe = {};
    AroundMe.MESSAGES = {
      FETCHING_DATA: 'Loading data...',
      SUCCESS: 'Successfuly retrieved data',
      ERROR: 'Failed to retrieve data'
    };

    var _aroundMe = false;
    var _currentLocation = false;

    var AROUND_ME_REST_PATH = '/yelp';

    function _translator(items) {
      var translated = [],
          deal;
      items = items || [];

      items.forEach(function(item, index) {
        deal = item.deals[0];
        try{
          translated.push({
            name: item.name,
            description: deal.additional_restrictions || deal.title,
            url: item.url,
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
