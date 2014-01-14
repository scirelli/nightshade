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

  .controller('CogitoCtrl', function($scope, Communicator) {


    $scope.$on(Communicator.MAP_MARKER_SELECTED_CHANNEL, function($e, data) {
      var marker = Communicator.packet;

      if(marker) {
        $scope.debug.marker = {
          title: marker.title,
          url: marker.url,
          description: marker.description,
          actionUrl: marker.actionUrl,
          lat: marker.lat,
          lon: marker.lon
        };
        $scope.$apply();
      }
    });

    $scope.optionsTray = {
      active: false
    };

    $scope.debug = {
      marker: null
    };

  })