angular.module('common.services.currentlocation', [])

.factory('CurrentLocation', function($q) {

  function _geolocator() {
    if(navigator && navigator.geolocation) {
      return navigator.geolocation;
    }
    else {
      return false;
    }
  }

  function _callback(defer, location) {
    defer.resolve(location);
  }

  return {

    get: function() {
      var locator = _geolocator(),
          defer = $q.defer();


      if( !locator ) {
        _callback(defer, {lat: 38.8951, lon: 77.0367});
      }
      else {
        locator.getCurrentPosition(function(position) {
          _callback(defer, {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        })
      }

      return defer.promise;
    }

  };

});