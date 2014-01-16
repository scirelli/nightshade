  
module.exports = YelpService = function(OAuth, Geocoder, Q, YelpConfig) {

    /**
     * @var STATUS 
     * Status Messages
     */
    var STATUS = {
        GEOCODER_ERROR: 'YelpService: Error occured while geocoding addresses',
        OAUTH_ERROR: 'YelpService: Error occured making OAuth reqeust',
        INCORRECT_BUSINESS_KEY: 'YelpService: Incorrect key for businesses',
        PARSE_YELP_RESPONSE_ERROR: 'YelpService: Error parsing Yelp Response',
        LAT_LON_REQUIRED: 'YelpService: Lat::Lon is required for search'
    };

    /**
     * @var _default_params
     * default params used in yelp search
     */ 
    var _default_params = {
        category_filter: 'arts,active,food,yelpevents,nightlife',
        deals_filter: true
    };

    /**
     * _success
     * success callback when retrieved lat:lon data from 
     * all yelp businesses
     * @param data {Object}
     * @return null
     */
    function _success(data, defer) {
        console.log('YelpService: ', 'success', new Date());
        defer.resolve(data);
    }

    /**
     * _error
     * error callback for geocoder queries
     * @param error {Object}
     * @return null
     */
    function _error(error, defer) {
        console.log('YelpService: ', 'error', error);
        defer.reject(new Error(STATUS.GEOCODER_ERROR));
    }

    /**
     * _notification
     * @param notification {Object}
     * notification callback for geocoder queries
     */
    function _notification(notification) {
        console.log('YelpService: ', notification);
    }

    /**
     * _address
     * parse business object to obtain the address. return false if error.
     * @param business {Object}
     * {
     *      location: {
     *          address: {{String}},
     *          city: {{String}},
     *          state_code: {{String}}
     *      }
     * }
     * @return {String}/{Boolean}
     */
    function _address(business) {
        var address = '';
        if(business.location) {
            if(business.location && business.location.address && business.location.address.length > 0) {
                address += business.location.address[0];
            }

            if(business.location.city && business.location.state_code) {
                address += ' ' + business.location.city + ' ' + business.location.state_code; 
            }

            return address;
        }
        else {
            return false;
        }
    }

    return {
        /**
         * search
         * use the Yelp search API
         * @param params {Object}
         * @return {Object}/{Promise}
         */
        search: function(lat, lon) {
            var defer = Q.defer(),
                params,                
                businesses,
                promises = [];

            console.log('Inside YelpService:');

            if( !lat && !lon ) {
                defer.reject(new Error(STATUS.LAT_LON_REQUIRED));
                return defer.promise;
            }

            params = _default_params,
            params.ll = lat + ',' + lon;

            console.log('YelpService: Setting up OAuth request');
            OAuth.client(YelpConfig);
            OAuth.get(YelpConfig.SEARCH_API_PATH, params, function(err, data, res) {


                console.log('YelpService: Parsing data');
                if(err) {
                    defer.reject(new Error(STATUS.OAUTH_ERROR));
                    return defer.promise;
                }

                if(typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } 
                    catch(e) {
                        console.log('YelpService: ', 'error parsing data', data)
                        defer.reject(new Error(STATUS.PARSE_YELP_RESPONSE_ERROR));
                        return defer.promise; 
                    }
                }

                businesses = data.businesses;

                if(businesses === undefined || businesses === null) {
                    console.log(STATUS.INCORRECT_BUSINESS_KEY);
                    defer.reject(new Error(STATUS.INCORRECT_BUSINESS_KEY));
                    return defer.promise;
                }

                if(businesses.length === 0) {
                    console.log('YelpService: ', 'Zero results returned');
                    defer.resolve([]);
                    return defer.promise;
                }

                businesses.forEach(function(business, index) {
                    var address = _address(business);
                    if(address) {
                        promises.push(Geocoder.query(address, business, "_location"));
                    }
                    else {
                        console.log('YelpService: ', 'failed to parse address', address);
                    }
                });

                if(promises.length > 0) {
                    Q.all(promises).then(function(data) {
                        _success(data, defer);
                    }, function(error) {
                        _error(error, defer);
                    }, function(notification) {
                        _notification(notification);
                    });
                }
                else {
                    defer.resolve([]);
                }

            });

            console.log('YelpService: returning promise');
            return defer.promise;
        }
    }
};
