
module.exports = YelpService = function(OAuth, Q, YelpConfig) {

    var translator = require('./YelpTranslator.js');
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

    

    return {
        /**
         * search
         * use the Yelp search API
         * @param lat {Number:float}
         * @param lon {Number:float}
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

                translator.translate(data).then(function(translated_and_categorized) {
                    _success(translated_and_categorized, defer);
                }, function(error) {
                    _error(error, defer);
                }, _notification);

            });

            return defer.promise;
        }
    }
};
