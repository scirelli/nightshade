angular.module('cg-map', [])
  .controller('MapCtrl', function($scope, aroundMe, currentLocation) {

    console.log(currentLocation);
    console.log(aroundMe);

    function _testTranslator(items) {
      var translated = [];

      // items.forEach(function(item, index) {
      //   translated.push({
      //     name: item.name,
      //   })
      // });

    }

    console.log(_testTranslator(aroundMe.businesses));

    $scope.map = {
      center: {
        lat: currentLocation.lat,
        lon: currentLocation.lon
      },
      points: []
    };
    

  });