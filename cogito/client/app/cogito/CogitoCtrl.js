angular.module("cogito")
  .controller("CogitoCtrl", function($scope, $timeout, Communicator) {
    var cogito = {};
    cogito.plans = [];

    $scope.alert = {
      list: [],
      new: function(alert) {
        var index = $scope.alert.list.push(alert);
        index = index - 1;

        $timeout(function() {
          $scope.alert.remove(index)
        }, 2000);

        return index;
      },
      remove: function(index) {
        $scope.alert.list.splice(index);
      }
    };


    $scope.$on(Communicator.ALERT_CHANNEL, function() {
      $scope.alert.new(Communicator.alertPacket);
    });
  });

