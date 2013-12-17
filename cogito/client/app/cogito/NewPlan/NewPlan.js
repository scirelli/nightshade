angular.module('cg-newplan', ['lib.services.communicator', 'common.services.plans'])
  .controller("NewPlanCtrl", function($scope, Plans, Communicator) {
    $scope.newPlan = {};
    $scope.newPlan.plan = {};

    var SUCCESS = {
      TYPE: 'success',
      MESSAGE: 'Successful adding a New Plan!'
    };

    var ERROR = {
      TYPE: 'error',
      MESSAGE: 'Successful adding a New Plan!'
    };

    $scope.newPlan.save = function(plan) {
      Plans.new(plan, function(error, data) {
        if(error) {
          Communicator.alert({
            type: ERROR.TYPE,
            msg: ERROR.MESSAGE
          });
          return;
        }

        console.log(SUCCESS.MESSAGE);
        Communicator.alert({
          type: SUCCESS.TYPE,
          msg: SUCCESS.MESSAGE 
        });
      });

      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        $scope.newPlan.plan = {};
      }
      else {
        $scope.$apply(function() {
          $scope.newPlan.plan = {}; 
        })
      }
    };
  });