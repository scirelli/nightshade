angular.module('cg-map', [])
  .controller('MapCtrl', function($scope, aroundMe, currentLocation) {

    console.log(currentLocation);
    console.log(aroundMe.data);

    function _translator(items) {
      var translated = [];

      try{
        items.forEach(function(item, index) {
          translated.push({
            name: item.name,
            lat: item._location.lat,
            lon: item._location.lon
          });
        }); 
      }
      catch(e) {
        console.log('error translating', e.toString());
      }

      return translated;
    }

    $scope.map = {
      center: {
        lat: currentLocation.lat,
        lon: currentLocation.lon
      },
      points: _translator(aroundMe.data);
    };
    

  });