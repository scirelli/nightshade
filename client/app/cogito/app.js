angular.module("cogito", [
  // /vendor/bootstrap/js
  'ui.bootstrap', 

  // modules
  'cg-table',
  'cg-newplan',
  'cg-plan',
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
        templateUrl: 'app/cogito/MapList/MapListTpl.html',
        controller: 'MapCtrl',
        resolve: {
          currentLocation: function($route, CurrentLocation) {
            return CurrentLocation.get();
          }
        }
      })
      .when('/table', {
        templateUrl: 'app/cogito/TableList/TableListTpl.html', 
        controller: 'TableCtrl',
        resolve: {
          plans: getPlans
        }
      })
      .when('/plan/:id', {
        templateUrl: 'app/cogito/Plan/PlanTpl.html', 
        controller: 'PlanCtrl',
        resolve: {
          plan: function($route, Plans) {
            return Plans.get($route.current.params.id);
          }
        }
      })
      .when('/plans/new', {templateUrl: 'app/cogito/NewPlan/NewPlanTpl.html', controller: 'NewPlanCtrl'})
      

      .otherwise({
        controller: 'TableCtrl',
        templateUrl: 'app/cogito/TableList/TableListTpl.html',
        resolve: {
          plans: getPlans
        }
      })
  });