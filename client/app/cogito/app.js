angular.module("cogito", [
  // /vendor/bootstrap/js
  'ui.bootstrap', 

  // modules
  'cg-list',
  'cg-map',

  // /app/common
  'common.directives.googlemap',
  'common.directives.optionstraycontrol',
  
  'common.services.currentlocation',

  // /app/lib
  'lib.services.communicator'
])

  .config(function($routeProvider) {

    function getPlans($route, Plans) {
      return Plans.fetch(); 
    }

    $routeProvider
      .when('/map', {
        controller: 'MapCtrl',
        templateUrl: 'app/cogito/Map/MapTpl.html'
      })
      .when('/list', {
        controller: 'ListCtrl',
        templateUrl: 'app/cogito/List/ListTpl.html'
      })
      .otherwise({
        controller: 'MapCtrl',
        templateUrl: 'app/cogito/Map/MapTpl.html',
      })
  })

  .controller('CogitoCtrl', function($scope, Communicator, CurrentLocation, AroundMe) {

    function _fetchAroundMe(params) {
      AroundMe.query(params, function(data, status, headers) {

        if(status != 200) {
          $scope.$apply(function() {
            console.log(data, status, headers);
            $scope.debug.status = AroundMe.MESSAGES.ERROR;
            $scope.list.fetchedData = false;
            $scope.map.fetchedData = false;

          });
        }
        else {
          $scope.list.items = data.collection; 
          $scope.list.fetchedData = true;
          $scope.debug.status = data.message;

          $scope.map.points = data.collection;
          $scope.map.fetchedData = true;
          $scope.debug.status = data.message;
        }
      });
    }

    $scope.optionsTray = {
      active: false
    };


    $scope.list = {
      fetchedData: false
    };

    $scope.debug = {};
    $scope.geo = {};
    $scope.debug.status = AroundMe.MESSAGES.FETCHING_DATA;
    CurrentLocation.get(function(loc) {

      if(!loc.lat || !loc.lon) {
        $scope.geo.status = loc.message;
      }

      Communicator.send(Communicator.MAP_SET_CENTER_CHANNEL, loc);
      $scope.geo.status = loc.message;
      _fetchAroundMe(loc);
    });

    $scope.map = {
      points: [],
      message: 'Obtaining your geolocation...',
      markerClick: function(marker) {
        Communicator.send(Communicator.MAP_MARKER_SELECTED_CHANNEL, marker);
      }
    };

  });