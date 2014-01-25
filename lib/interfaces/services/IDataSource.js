/**
 * IDataSource
 * Interface to represent all data source services used to
 * fetch data from respective API.
 */
function IDataSource() {};

IDataSource.prototype = {

  /**
   * search
   * search data source by lat lon
   * @param lat {Number:float}
   * @param lon {Number:float}
   * @return {Object} / {Promise}
   */
  search: function(lat, lon) {}

}

module.exports = IDataSource;