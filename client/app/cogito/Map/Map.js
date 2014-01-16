angular.module('cg-map', [
  'lib.services.communicator',

  'common.services.aroundme'
])
  .controller('MapCtrl', function($scope, CurrentLocation, AroundMe, Communicator) {
    $scope.map = {
      fetchedData: false
    };

    function _fetchAroundMe(params) {
      AroundMe.query(params, function(data, status, headers) {
        if(status != 200) {
          console.log(data, status, headers);
          $scope.debug.status = AroundMe.MESSAGES.ERROR;
          return;
        }

        var points = data;
        $scope.map.points = points;
        $scope.map.fetchedData = true;
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

      // _fetchAroundMe(location);
    });

  });