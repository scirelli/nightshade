angular.module('lib.directives.draganddrop', [])
  .directive('dd', function(Communicator) {

    /**
     * add dataTransfer property for use with
     * native 'drop' event to capture information
     * about dropped item
     */
    $.event.props.push("dataTransfer");

    /**
     * Draggable
     */
    var Draggable = function($el) {

      $el.attr('draggable', true);

      /**
       * mouse is held down and moved on 
       * draggable item
       */
      $el.on('dragstart', function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML); 
      });

      /**
       * mouse is released on draggable item
       */
      $el.on('dragend', function(e) {
        var point = {};
        e = e.originalEvent;

        point.x = e.clientX;
        point.y = e.clientY;

        Communicator.send(point);
      });
    }

    /**
     * Droppable
     */
    var Droppable = function($el, onDropCallback) {

      /**
       * begin dragging over drop area
       */
      $el.on('dragenter', function(e) {
        //console.log('dragenter', e);
      });

      /**
       * the item being dragged enters the drop area,
       * leaves/enters sub element inside of drop area element,
       * mouse is being held down while over
       * the drop area
       */
      $el.on('dragover', function(e) {
        // required for drop event to be called 
        if(e.preventDefault) {
          e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
      });

      /**
       * the item being dragged leaves the drop area, 
       * leaves/enters sub element inside of drop area element,
       * or has been dropped
       */
      $el.on('dragleave', function(e) {
      });

      $el.on('drop', function(e) {

        if(e.stopPropagation) {
          e.stopPropagation();
        }
      });
    }

    return {
      restrict: 'A',

      link: function($scope, $element, $attrs) {

        if($attrs.ddDraggable || $attrs.draggable) {
          //create draggable object 
          var draggable = new Draggable($element);
        }

        if($attrs.ddDroppable) {
          //create droppable object 
          var droppable = new Droppable($element);
        }

      }
    }

  });

