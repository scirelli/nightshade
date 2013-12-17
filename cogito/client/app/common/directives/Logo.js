angular.module('common.directives.logo', [])
  .directive('logo', function() {

    return {
      restrict: 'E',
      replace: true,

      template: 
        '<div class="cg-logo">' + 
          '<h1>' + 
            '<div class="label label-default">Cogito</div>' + 
          '</h1' + 
        '</div>'
    };
  });