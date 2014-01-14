angular.module("common.directives.optionstraycontrol", [])

  .controller("OptionsTrayControlCtrl", function($scope) {
  })

  .directive("optionstraycontrol", function() {
    return {
      restrict: 'A',
      replace: true,
      controller: "OptionsTrayControlCtrl",
      template: 
        '<div class="options-tray-control">' +
          '<a ng-click="optionsTray.active =! optionsTray.active">' + 
            '<span class="icon-menu"></span>' +
          '</a>' +
        '</div>'
    }
  });