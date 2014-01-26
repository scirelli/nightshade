var http = require('http'),
    querystring = require('querystring'),
    Q = require('q');

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

/**
 * @var GeocodeConfig
 */
var GeocodeConfig;

/**
 * _latLon
 * extract lat:lon coordinates
 * @param results [{Object}]
 * [ ... 
 * {
 *      geometry: {
            location: {
                lat: {Number},
                lng: {Number}
            }
 *      }
 * }
 * ...
 * ]
 * 
 * @return {Object} | false
 * {
 *      lat: {Number}/{Null}/{Undefined}
 *      lon: {Number}/{Null}/{Undefined}
 * }
 */
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

function GoogleGeocoder(config) {
   GeocodeConfig = require('./config.js');
}
    
GoogleGeocoder.prototype = {

    query: function(address) {
        var defer = Q.defer(),
            options = {
                hostname: GeocodeConfig.HOST,
                port: GeocodeConfig.PORT,
                method: GeocodeConfig.METHOD
            };

        if(!address || typeof address !== 'string') {
            defer.reject(new Error(STATUS.ADDRESS_REQUIRED));
            return defer.promise;
        }

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
                    }
                }

                console.log('GoogleGeocoder: extracting lat::lon', geoData, address);
                geoData = _latLon(geoData.results);
                if(geoData) {
                    defer.resolve(geoData);
                }
                else {
                    defer.reject(new Error(STATUS.ERROR_EXTRACTING_LAT_LON));
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
};

module.exports = GoogleGeocoder;