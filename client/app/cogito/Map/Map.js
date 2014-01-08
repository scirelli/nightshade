angular.module('cg-map', [
  'lib.services.communicator',

  'common.services.aroundme'
])
  .controller('MapCtrl', function($scope, CurrentLocation, AroundMe, Communicator) {

    function _translator(items) {
      var translated = [];

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

    function _fetchAroundMe(params) {
      AroundMe.query(params, function(data, status, headers) {
        var points = data;
        $scope.map.points = points;
      }); 
    }

    $scope.map = {
      points: [],
      message: 'Obtaining your geolocation...',
      markerClick: function(marker) {
        Communicator.send(Communicator.MAP_MARKER_SELECTED_CHANNEL, marker);
      }
    };

    CurrentLocation.get(function(location) {
      Communicator.send(Communicator.MAP_SET_CENTER_CHANNEL, location);
      $scope.map.message = location.message;

      _fetchAroundMe(location);
    });

  });