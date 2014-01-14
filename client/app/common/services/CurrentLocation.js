angular.module('common.services.currentlocation', [])

  .factory('CurrentLocation', function($q, $timeout) {
    var MESSAGES = {
      NOT_SUPPORTED: 'Unable to obtain geolocation. Your browser does not support geolocation',
      PERMISSION_DENIED: 'Unable to obtain geolocation. You did not grant this application permission to obtain your location',
      POSITION_UNAVAILABLE: 'Unable to obtain gelocation. Your position is not available at the moment.',
      TIMEOUT: 'Unable to obtain geolocation. There was a timeout.',
      UNKNOWN: 'Unable to obtain geolocation. Unknown geolocation error.',
      CACHED: 'Using your last known position.'
    };

    var _location = {
      lat: null,
      lon: null,
      message: ''
    };

    var FAKE_LOCATION = false;

    var _fake_location = {
      lat: 38.92102219786375,
      lon: -77.03115463256836
    };

    var CurrentLocation = {};

    function _geolocator() {
      if(navigator && navigator.geolocation) {
        return navigator.geolocation;
      }
      else {
        _location.message = MESSAGES.NOT_SUPPORTED;
        return false;
      }
    }

    function _successfulGeolocation(position) {
      var lat = position.coords.latitude,
          lon = position.coords.longitude,
          message = "Successfully obtained geolocation! ( lat: " + lat + " lon: " + lon + " )";

      _location = {
        lat: lat,
        lon: lon,
        message: message
      };
    }

    function _cachedGeolocation() {
      var message = 'Using your last known position. ( lat: ' + _location.lat + ' lon: ' + _location.lon + ' )';
      _location.message = message;
    }

    function _failedGeolocation(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          _location.message = MESSAGES.PERMISSION_DENIED;
          break;
        case error.POSITION_UNAVAILABLE:
          _location.message = MESSAGES.POSITION_UNAVAILABLE;
          break;
        case error.TIMEOUT:
          _location.message = MESSAGES.TIMEOUT;
          break;
        case error.UNKNOWN_ERROR:
          _location.message = MESSAGES.UNKNOWN;
          break;
      }
    }

    function _doCallback(callback, location) {
      if(FAKE_LOCATION) {
        location.lat = _fake_location.lat;
        location.lon = _fake_location.lon;
      }
      console.log('using location: ', location);
      callback(_location);
    }

    function _get(callback) {
      if(_location.lat && _location.lon) {
        _cachedGeolocation();
        $timeout(function() {
          _doCallback(callback, _location);
        }, 100);
        return;
      }

      var locator = _geolocator();

      if(!locator) {
        doCallback(_location);
      }

      locator.getCurrentPosition(function(position) {
        _successfulGeolocation(position);
        $timeout(function() {
          _doCallback(callback, _location);
        }, 100);
      }, function(error) {
        _failedGeolocation(error);
        doCallback(callback, _location);
      });
      return;
    }

    CurrentLocation = {
      get: _get
    };

    return CurrentLocation;

  });