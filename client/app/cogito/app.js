angular.module("cogito", [
  // /vendor/bootstrap/js
  'ui.bootstrap', 

  // modules
  'cg-list',
  'cg-map',

  // /app/common
  'common.directives.logo',
  'common.directives.header',
  'common.directives.navigation',
  'common.directives.editable',
  'common.directives.googlemap',
  'common.services.plans',
  'common.services.latlngconverter',
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
        templateUrl: 'app/cogito/Map/MapTpl.html',
        controller: 'MapCtrl'
      })
      .when('/list', {
        templateUrl: 'app/cogito/List/ListTpl.html', 
        controller: 'ListCtrl',
      })
      .otherwise({
        controller: 'ListCtrl',
        templateUrl: 'app/cogito/List/ListTpl.html',
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
          lat: marker.lat,
          lon: marker.lon
        };
        $scope.$apply();
      }
    });

    $scope.debug = {
      marker: null
    };

  })