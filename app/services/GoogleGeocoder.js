module.exports = GoogleGeocoder = function(http, querystring, Q, GeocodeConfig) {

    /**
     * @var STATUS 
     * Status Messages
     */
    var STATUS = {
        GEOCODER_ERROR: 'GoogleGeocoder: Error during geocode request',
        PARSE_GEOCODE_RESPONSE_ERROR: 'GoogleGeocoder: Error parsing Geocode Response',
        ERROR_EXTRACTING_LAT_LON: 'GoogleGeocoder: Failed to extract geocode data',
        ADDRESS_REQUIRED: 'GoogleGeocoder: Address is required for query'
    };

    var _default_params = {
        hostname: GeocodeConfig.HOST,
        port: GeocodeConfig.PORT,
        path: GeocodeConfig.PATH,
        method: GeocodeConfig.METHOD
    };

    function _latLon(results) {
        var first;
        if(results.length === 0) {
            console.log('GoogleGeocoder: empty results', results);
            return {
                lat: null,
                lon: null
            };
        }

        first = results[0];
        try{
            return {
                lat: first.geometry.location.lat,
                lon: first.geometry.location.lng
            };
        }
        catch(e) {
            console.log('could not get geometry data from first item', first);
            return false;
        }
    }

    /**
     * _success
     * success callback when retrieved lat:lon data from 
     * all yelp businesses
     * @param data {Object}
     * @return null
     */
    function _success(data) {
        console.log('GoogleGeocoder: ', 'success', data);
        defer.resolve(data);
    }

    /**
     * _error
     * error callback for geocoder queries
     * @param error {Object}
     * @return null
     */
    function _error(error) {
        console.log('GoogleGeocoder: ', 'error', error);
        defer.reject(new Error(STATUS.GEOCODER_ERROR));
    }

    /**
     * _notification
     * @param notification {Object}
     * notification callback for geocoder queries
     */
    function _notification(notification) {
        console.log('GoogleGeocoder: ', notification);
    }

    return {
        query: function(address, business, key) {
            var defer = Q.defer();

            if(!address || typeof address !== 'string') {
                defer.reject(new Error(STATUS.ADDRESS_REQUIRED));
                return defer.promise;
            }

            var options = _default_params;
            options.path = GeocodeConfig.PATH + querystring.stringify({address: address}) + '&sensor=true';

            var request = http.request(options, function(res) {
                var geoData = '';
                res.on('data', function(data) {
                    geoData += data;
                });

                res.on('end', function() {
                    if(typeof geoData == 'string') {
                        try {
                            geoData = JSON.parse(geoData);
                        }
                        catch(e) {
                            console.log(STATUS.PARSE_GEOCODE_RESPONSE_ERROR, e);
                            defer.reject(new Error(STATUS.PARSE_GEOCODE_RESPONSE_ERROR));
                        };    
                    }

                    // console.log('GoogleGeocoder: extracting lat::lon', geoData, address);
                    geoData = _latLon(geoData.results);
                    if(geoData) {
                        business[key] = geoData;
                        defer.resolve(business);
                    }
                    else {
                        defer.reject(new Error(STATUS.ERROR_EXTRACTING_LAT_LON))
                    }
                });

            });

          request.on('error', function(e) {
            console.log(STATUS.GEOCODER_ERROR, e);
            defer.reject(new Error(STATUS.GEOCODER_ERROR));
          });


          request.end();
          return defer.promise;
        }
    }
}