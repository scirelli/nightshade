/**
 * IGeocoder
 * Interface to represent all geocoder services used to
 * obtain geospatial data.
 */
function IGeocoder() {}

IGeocoder.prototype = {

  /**
   * query
   * address provided is used to obtain geospatial information
   * @param address {String}
   * @return {Object} / {Promise}
   */
  query: function(address) {}
}