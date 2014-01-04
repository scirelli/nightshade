angular.module('common.services.latlngconverter', [])
  .factory('LatLngConverter', function() {
    var LatLngConverter = function(map) {
      this.setMap(map);
    }

    LatLngConverter.prototype = new google.maps.OverlayView();
    LatLngConverter.prototype.draw = function() {};

    LatLngConverter.prototype.fromPxToLatLon = function(x, y) {
      var projection = this.getProjection(),
          point,
          latLon;

      point = new google.maps.Point(x, y);
      latLon = projection.fromDivPixelToLatLng(point);
      return latLon;
    }

    LatLngConverter.prototype.fromLatLontoPx = function(latLon) {
      var projection = this.getProjection(),
          point;

      point = projection.fromLatLonToDivPixel(latLon);
      return point;
    }

    return LatLngConverter;
  });