angular.module('cg-map', [
  'common.services.aroundme'
])
  .controller('MapCtrl', function($scope, CurrentLocation, AroundMe) {

    var self = this;

    function _translator(items) {
      var translated = [];

      items.forEach(function(item, index) {
        try{
          translated.push({
            name: item.name,
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


    CurrentLocation.get(function(location) {
      if(!$scope.$$phase || !$scope.$root.$$phase) {
        $scope.$apply(function() {
          $scope.map.center = location;
          $scope.map.hasLocation = true;
        });
      }
      else {
        $scope.map.center = location;
        $scope.map.hasLocation = true;
      }
    });

    $scope.map = {
      points: [],
      hasLocation: false
    };

    // AroundMe.query({}, function(data, status, headers) {
    //   var points = _translator(data);

    //   $scope.map.points = points;
    // });

    $scope.$watch('map.bounds', function(newValue, oldValue) {
      // console.log(newValue, oldValue);
    });

  });