angular.module('cg-table', ['common.services.plans'])
  .controller("TableCtrl", function($scope, plans) {
    $scope.table = {};
    $scope.table.plans = plans.data || []; 

  });