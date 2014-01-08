angular.module('cg-list', [
  'lib.services.communicator',

  'common.services.aroundme'
])
  .controller("ListCtrl", function($scope, CurrentLocation, AroundMe, Communicator) {
    $scope.list = {};

    function _fetchAroundMe(params) {
      AroundMe.query(params, function(data, status, headers) {
        var items = data;
        $scope.list.items = items;
        $scope.debug.status = data.message;
      });
    }

    CurrentLocation.get(function(location) {
      _fetchAroundMe(location);
    });

  });