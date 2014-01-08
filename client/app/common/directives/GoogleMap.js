angular.module("common.directives.googlemap", [])
  .directive('googlemap', function(Communicator, LatLngConverter, $timeout) {

    var _map;

    var _latLngConverter;

    function _clickCallback(marker, callback) {
      return function(event) {
        callback({marker: marker});
      }
    }

    function _addMarker(config) {
      var latLng = new google.maps.LatLng(config.lat, config.lon),
          point = {};

      point.position = latLng;
      point.map = config.map;
      point.title = config.title;
      point.actionUrl = config.actionUrl;
      point.url = config.url;
      point.description = config.description;

      marker = new google.maps.Marker(point);
      marker.lat = marker.getPosition().lat();
      marker.lon = marker.getPosition().lng();

      google.maps.event.addListener(marker, 'click', _clickCallback(marker, config.clickCallback)); 
      config.addCallback({marker: marker});
    }

    function _setCenter(lat, lon) {
      $timeout(function() {
        var latLng = new google.maps.LatLng(lat, lon);
        _map.setCenter(latLng);
      });
    }

    function _addPoints(points, clickCallback, addCallback) {
      var i, point, latLng, marker;
      for(i = 0, len = points.length; i < len; ++i) {
        point = points[i];

        _addMarker({
          title: point.name, 
          lat: point.lat, 
          lon: point.lon, 
          description: point.description,
          actionUrl: point.actionUrl,
          url: point.url,
          map: _map, 
          clickCallback: clickCallback,
          addCallback: addCallback
        });
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
        // $scope.$on(Communicator.CHANNEL, function($e, data) {
        //   var point = Communicator.packet,
        //       latLon = _latLngConverter.fromPxToLatLon(point.x, point.y);

        //     _addMarker({
        //       title: '', 
        //       lat: latLon.lat(), 
        //       lon: latLon.lng(), 
        //       map: _map, 
        //       clickCallback: $scope.onMarkerClick,
        //       addCallback: $scope.onMarkerAdd
        //     });
        // });

        $scope.$watch('points', function(points) {
          if(points && points.length > 0) {
            _addPoints(points, $scope.onMarkerClick, $scope.onMarkerAdd)
          }
        });

        // $scope.$watch('center', function(newCenter) {
        //   if(newCenter) {
        //     _setCenter(newCenter.lat, newCenter.lon);
        //   }
        // });

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

          _latLngConverter = new LatLngConverter(_map);

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