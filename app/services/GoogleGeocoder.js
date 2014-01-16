module.exports = GoogleGeocoder = function() {

    var http = require('http'),
        querystring = require('querystring'),
        Q = require('q'),
        GeocodeConfig = require('../../config/config.global.js');


    GeocodeConfig = GeocodeConfig.GOOGLE_GEOCODER;
    if(!GeocodeConfig) {
        console.log(GeocodeConfig);
        throw 'GeocodeConfig did not load properly';
        return;
    }

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

    return {
        query: function(address, business, key) {
            var defer = Q.defer();

            if(!address || typeof address !== 'string') {
                defer.reject(new Error(STATUS.ADDRESS_REQUIRED));
                return defer.promise;
            }

            var options = _default_params;
            options.path = GeocodeConfig.PATH + querystring.stringify({address: address}) + '&sensor=true';

            console.log('GoogleGeocoder: ', options.hostname, options.path);

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

                    console.log('GoogleGeocoder: extracting lat::lon', geoData, address);
                    geoData = _latLon(geoData.results);
                    if(geoData) {
                        defer.resolve(geoData);
                    }
                    else {
                        defer.reject(new Error(STATUS.ERROR_EXTRACTING_LAT_LON))
                    }
                });

            });

          request.on('error', function(e) {
            console.log(STATUS.GEOCODER_ERROR, e, address);
            defer.reject(new Error(STATUS.GEOCODER_ERROR));
          });


          request.end();
          return defer.promise;
        }
    }
}