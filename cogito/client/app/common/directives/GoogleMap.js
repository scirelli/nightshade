angular.module("mapcontrol")
  .directive('googlemap', function(Communicator, LatLonConverter) {

    var _map;

    var _latLonConverter;

    function _clickCallback(marker, callback) {
      return function(event) {
        callback({marker: marker});
      }
    }

    function _addMarker(config) {
      var latLng = new google.maps.LatLng(config.lat, config.lon),
          point = {};

      point.position = latLng,
      point.map = config.map,
      point.title = config.title;

      marker = new google.maps.Marker(point);
      marker.lat = marker.getPosition().lat();
      marker.lon = marker.getPosition().lng();

      google.maps.event.addListener(marker, 'click', _clickCallback(marker, config.clickCallback)); 

      config.addCallback({marker: marker});
    }

    return {
      restrict: 'E',
      replace: true,
      priority: 100,
      scope: {
        points: '=',
        center: '=',
        bounds: '=',
        mapZoom: '=',

        onMapCenterchanged: '&',
        onMapBoundschanged: '&',
        onMapClick: '&',
        onMapDblclick: '&',
        onMapDrag: '&',
        onMapDragend: '&',
        onMapDragstart: '&',
        onMapTilesloaded: '&',
        onMapZoomchanged: '&',

        onMarkerClick: '&',
        onMarkerAdd: '&'
      },

      template: '<div class="google-map fill"></div>',

      controller: function($scope, $element) {
        $scope.$on(Communicator.CHANNEL, function(data) {
          var point = Communicator.packet,
              latLon = _latLonConverter.fromPxToLatLon(point.x, point.y);

            _addMarker({
              title: '', 
              lat: latLon.lat(), 
              lon: latLon.lng(), 
              map: _map, 
              clickCallback: $scope.onMarkerClick,
              addCallback: $scope.onMarkerAdd
            });
        });
      },

      compile: function(element, attrs, transclude) {

        return function($scope, $element, attrs) {

          _map = new google.maps.Map($element[0], {
            center: new google.maps.LatLng($scope.center.lat, $scope.center.lon),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          _latLonConverter = new LatLonConverter(_map);

          google.maps.event.addListener(_map, 'center_changed', function() {
            $scope.$apply(function() {
              var center = _map.getCenter();
              $scope.center = {
                lat: center.lat(),
                lon: center.lng()
              };
            });
          });

          google.maps.event.addListener(_map, 'bounds_changed', function() {
            $scope.$apply(function() {
              var bounds = _map.getBounds(),
                  ne = bounds.getNorthEast(),
                  sw = bounds.getSouthWest();
              $scope.bounds = {
                ne: ne.lat() + ', ' + ne.lng(),
                sw: sw.lat() + ', ' + sw.lng()
              };
            });
          });

          google.maps.event.addListener(_map, 'click', function() {
          });

          google.maps.event.addListener(_map, 'dblclick', function() {
          });

          google.maps.event.addListener(_map, 'drag', function() {
          });

          google.maps.event.addListener(_map, 'dragstart', function() {
          });

          google.maps.event.addListener(_map, 'dragend', function() {
          });

          google.maps.event.addListener(_map, 'tilesloaded', function() {
          });

          google.maps.event.addListener(_map, 'zoom_changed', function() {
          });


          var i, point, latLng, marker;
          for(i = 0, len = $scope.points.length; i < len; ++i) {
            point = $scope.points[i];

            _addMarker({
              title: point.name, 
              lat: point.lat, 
              lon: point.lon, 
              map: _map, 
              clickCallback: $scope.onMarkerClick,
              addCallback: $scope.onMarkerAdd
            });
          }
        };
      } 
    };
  });