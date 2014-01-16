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
        $scope.list.items = items;
        $scope.list.fetchedData = true;
        $scope.debug.status = data.message;
      });
    }

    $scope.debug.status = AroundMe.MESSAGES.FETCHING_DATA;
    CurrentLocation.get(function(location) {
      // _fetchAroundMe(location);
    });

  });