angular.module('common.directives.navigation', [])
  .directive('navigation', function() {

    return {
      restrict: 'E',
      replace: true,

      template: 
        '<div class="well">' + 
          '<ul class="nav nav-list">' +
            '<li>Manage</li>' +

            '<li><a href="#">All</a></li>' +

            '<li><a href="#/new">New</a></li>' +

            '<li>View</li>' +

            '<li><a href="#/map">Map</a></li>' +

            '<li><a href="#/table">Table</a></li>' +

            '<li class="nav-divider"></li>' +

            '<li><a href="#help" class="muted">Help</a></li>' +

            '<li><a href="/logout" class="muted">Logout</a></li>' +
          '</ul>' +
        '</div>'
    };
  });