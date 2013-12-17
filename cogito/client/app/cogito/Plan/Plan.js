angular.module('cg-plan', ['common.services.plans'])
  .controller('PlanCtrl', function($scope, plan, Plans) {

    var COMPARE_BY_VALUE = true;

    $scope.plan = plan.data || [];

    $scope.plan.save = function(key, value) {
      var id = $scope.plan.id,
          plan = $scope.plan;

      Plans.update(id, key, value, plan);
    };
  });