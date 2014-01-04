angular.module('common.directives.header', [])
  .directive('header', function() {
    return {
      restrict: 'E',
      replace: true,

      templateUrl: '/partials/header'
    }
  });
