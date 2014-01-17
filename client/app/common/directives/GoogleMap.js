angular.module("common.directives.googlemap", [])
  .directive('googlemap', function(Communicator, $timeout) {

    var _map;

    var _latLngConverter;

    function _clickCallback(marker, callback) {
      return function(event) {
        callback({marker: marker});
      }
    }

    function _addMarker(config) {
      if(!config.lat || !config.lon) {
        return;
      }
      var latLng = new google.maps.LatLng(config.lat, config.lon),
          marker;

      angular.extend(config, {
        position: latLng,
        optimized: false,
        zIndex: google.maps.Marker.MAX_ZINDEX
      });
      
      marker = new google.maps.Marker(config);
      marker.lat = marker.getPosition().lat();
      marker.lon = marker.getPosition().lng();
      google.maps.event.addListener(marker, 'click', _clickCallback(marker, config.clickCallback)); 
      config.addCallback({marker: marker});
    }

    function _setCenter(lat, lon) {
      $timeout(function() {
        var latLng = new google.maps.LatLng(lat, lon),
            center = {};

        _map.setCenter(latLng);

        center.position = latLng;
        center.map = _map;
        center.zIndex = 1;
        center.optimized = false;
        center.icon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#0489B1',
          fillOpacity: .7,
          strokeColor: '#0489B1',
          strokeOpacity: .9,
          strokeWeight: 1
        };

        center = new google.maps.Marker(center);
      });
    }

    function _addPoints(points, clickCallback, addCallback) {
      var i, point, latLng, marker;
      for(i = 0, len = points.length; i < len; ++i) {
        point = points[i];

        angular.extend(point, {
          lat: point.location.lat,
          lon: point.location.lon,
          map: _map,
          clickCallback: clickCallback,
          addCallback: addCallback
        });

        _addMarker(point);
      }
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

        $scope.$watch('points', function(points) {
          if(points && points.length > 0) {
            _addPoints(points, $scope.onMarkerClick, $scope.onMarkerAdd)
          }
        });

        $scope.$on(Communicator.MAP_SET_CENTER_CHANNEL, function($e) {
          var center = Communicator.packet;
          if(center) {
            _setCenter(center.lat, center.lon);
          }
        })
      },

      compile: function(element, attrs, transclude) {

        return function($scope, $element, attrs) {

          var lat = 0, 
              lon = 0;

          if($scope.center && $scope.center.lat && $scope.center.lon) {
            lat = $scope.center.lat;
            lon = $scope.center.lon;
          }

          _map = new google.maps.Map($element[0], {
            center: new google.maps.LatLng(lat, lon),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

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

          // set the new center of the map when value changes
          // $scope.$watch('center', function(newValue) {
          //   if(newValue && newValue.lat && newValue.lon) {
          //     _setCenter(newValue.lat, newValue.lon);
          //   }
          // });

          _addPoints($scope.points, $scope.onMarkerClick, $scope.onMarkerAdd) 
        };
      } 
    };
  });