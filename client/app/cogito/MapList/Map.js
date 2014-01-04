angular.module('cg-map', [
  'common.services.aroundme'
])
  .controller('MapCtrl', function($scope, currentLocation, AroundMe) {

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

    $scope.map = {
      center: currentLocation,
      // points: _translator(aroundMe.data);
      points: []
    };

    AroundMe.query({}, function(data, status, headers) {
      var points = _translator(data);

      $scope.map.points = points;
    });

    $scope.$watch('map.bounds', function(newValue, oldValue) {
      // console.log(newValue, oldValue);
    });

    $scope.$watch('map.center', function(newValue, oldValue) {
      console.log(newValue, oldValue);
      if(newValue) {
         
      }
    });


  });