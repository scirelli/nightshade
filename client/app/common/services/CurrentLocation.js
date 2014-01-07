angular.module('common.services.currentlocation', [])

  .factory('CurrentLocation', function($q) {
    var _location;

    var CurrentLocation = {};

    function _geolocator() {
      if(navigator && navigator.geolocation) {
        return navigator.geolocation;
      }
      else {
        return false;
      }
    }

    function _get(callback) {
      var locator = _geolocator();

      locator.getCurrentPosition(function(position) {
        _location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

        callback(_location);
      });
      return;
    }

    CurrentLocation = {
      get: _get
    };

    return CurrentLocation;

  });