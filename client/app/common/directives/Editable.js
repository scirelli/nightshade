angular.module('common.directives.editable', [])
  .directive('editable', function() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        key: '@key',
        htmlElement: '@htmlElement',
        editElement: '@editElement',
        displayValue: '@displayValue',
        saveControls: '@saveControls',

        value: '=value',

        onSave: '&onSave'
      },

      template: '<div></div>',

      compile: function($element, $attrs) {

        var _$htmlElement,
            _$editElement,
            _$saveBtn,
            _$cancelBtn;

        _$htmlElement = $('<' + $attrs.htmlElement + '>')
                          .html('{{displayValue}}')
                          .appendTo($element);

        _$editElement = $('<' + $attrs.editElement + '>')
                              .addClass('hide')
                              .attr('ng-model', 'value')
                              .appendTo($element);

        _$saveBtn = $('<button class="save btn btn-default btn-sm hide">Save</button>');

        _$cancelBtn = $('<button class="cancel btn btn-default btn-sm hide">Cancel</button>'); 

        if($attrs.saveControls) {
          _$saveBtn.insertAfter(_$editElement); 
          _$cancelBtn.insertAfter(_$saveBtn);
        }

        var _oldVal;

        /* helper functions */
        function _edit() {
          _$htmlElement.hide(); 
          _$editElement.removeClass('hide').focus();
          _$saveBtn.removeClass('hide');
          _$cancelBtn.removeClass('hide');
        }

        function _preview() {
          _$htmlElement.show();
          _$editElement.addClass('hide');
          _$saveBtn.addClass('hide');
          _$cancelBtn.addClass('hide');
        }

        function _showControls($el) {
          $el.css('border', '1px solid green');
        }

        function _hideControls($el) {
          $el.css('border', 'none');
        }

        function _onMouseover($el) {
          $el.on('mouseover', function() {
            _showControls($el);
          });

          $el.on('mouseout', function() {
            _hideControls($el);
          });
        }

        function _offMouseover($el) {
          $el.off('mouseover')
          $el.off('mouseout');
        }
        /* end helper functions */

        return function($scope, $element, $attrs) {
          _onMouseover($element);

          $element.on('click', ($scope.htmlElement || $attrs.htmlElement), function() {
            var $el = $(this);
            _offMouseover($element);
            _hideControls($element);
            _oldVal = $scope.value;
            _edit();
          });

          $element.on('click', 'button.save', function() {
            _preview(); 
            _onMouseover($element);

            $scope.onSave({key: $scope.key, value: $scope.value});
          });

          $element.on('click', 'button.cancel', function() {
            $scope.$apply(function() {
              $scope.value = _oldVal;
            });

            _preview(); 
            _onMouseover($element);
          });
        };
      } 

    }
  });
