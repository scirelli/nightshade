angular.module('cg-list', [
  'lib.services.communicator',

  'common.services.aroundme'
])
  .controller("ListCtrl", function($scope, CurrentLocation, AroundMe, Communicator) {
    $scope.list = {
      fetchedData: false
    };

    function _fetchAroundMe(params) {
      AroundMe.query(params, function(data, status, headers) {

        if(status != 200) {
          console.log(data, status, headers);
          $scope.debug.status = AroundMe.MESSAGES.ERROR;
          return;
        }

        var items = data;
        $scope.list.items = [];
        for(var category in items) {
          if(items.hasOwnProperty(category) && category !== 'message') {
            items[category].forEach(function(item) {
              $scope.list.items.push(item);
            });
          }
        }
        $scope.list.fetchedData = true;
        $scope.debug.status = data.message;
      });
    }

    $scope.debug.status = AroundMe.MESSAGES.FETCHING_DATA;
    CurrentLocation.get(function(location) {
      _fetchAroundMe(location);
    });

  });