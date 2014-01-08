angular.module('cg-map', [
  'lib.services.communicator',

  'common.services.aroundme'
])
  .controller('MapCtrl', function($scope, CurrentLocation, AroundMe, Communicator) {

    function _fetchAroundMe(params) {
      AroundMe.query(params, function(data, status, headers) {
        var points = data;
        $scope.map.points = points;
        $scope.debug.status = data.message;
      }); 
    }

    $scope.map = {
      points: [],
      message: 'Obtaining your geolocation...',
      markerClick: function(marker) {
        Communicator.send(Communicator.MAP_MARKER_SELECTED_CHANNEL, marker);
      }
    };

    $scope.debug.status = AroundMe.MESSAGES.FETCHING_DATA;
    CurrentLocation.get(function(location) {
      Communicator.send(Communicator.MAP_SET_CENTER_CHANNEL, location);
      $scope.map.message = location.message;

      _fetchAroundMe(location);
    });

  });