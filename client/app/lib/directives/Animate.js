angular.module('lib.directives.animate', [])
  .directive('animate', function($timeout) {

    var _originalValues = {
      width: null,
      height: null
    }

    function _setOriginalValues($element) {
      _originalValues.width = $element.width();
      _originalValues.height = $element.height();

      _originalValues.paddingLeft = $element.css('padding-left');
      _originalValues.paddingRight = $element.css('padding-right');
    }

    function _show($element) {
      if($element.animate) {
        $element.animate({
          width: _originalValues.width,
          paddingLeft: _originalValues.paddingLeft,
          paddingRight: _originalValues.paddingRight
        });
      }
    }

    function _hide($element) {
      if($element.animate) {
        $element.animate({
          width: 0,
          paddingLeft: 0,
          paddingRight: 0
        });
      } 
    }

    function _getTargetElement($element) {
      var el = $element.children()[0];

      return $( el );
    }

    return {
      restrict: 'A',

      link: function($scope, $element, $attrs) {
        var $el = _getTargetElement($element);
        
        $timeout(function(){
            _setOriginalValues($el);

            $scope.$watch($attrs.animateShow, function(newValue, oldValue) {
              var $el = _getTargetElement($element);
              if(newValue === true) {
                _show($el);
              }
              else {
                _hide($el);
              }
            }, true);    
        }, 100);
        
      }
    };
  });

