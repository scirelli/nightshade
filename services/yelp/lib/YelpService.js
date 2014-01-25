var Q = require('Q');

/**
 * @var STATUS 
 * Status Messages
 */
var STATUS = {};
STATUS.SELF = 'YelpService: ';
STATUS.GEOCODER_ERROR = STATUS.SELF + 'Error occured while geocoding addresses';
STATUS.OAUTH_ERROR = STATUS.SELF + 'Error occured making OAuth reqeust';
STATUS.INCORRECT_BUSINESS_KEY = STATUS.SELF + 'Incorrect key for businesses';
STATUS.PARSE_YELP_RESPONSE_ERROR = STATUS.SELF + 'Error parsing Yelp Response';
STATUS.LAT_LON_REQUIRED = STATUS.SELF + 'Lat::Lon is required for search';

/**
 * @var YELP_CATEGORY_FILTERS
 */
var YELP_CATEGORY_FILTERS = ['arts', 'active', 'food', 'yelpevents', 'nightlife'].toString();

/**
 * @var YELP_DEALS_FILTER
 */
var YELP_DEALS_FILTER = true;

/**
 * @var _YELP_SEARCH_PATH
 */
var _YELP_SEARCH_PATH;

/**
 * @var _translator
 */
var _translator;

/**
 * @var _oauth
 */
var _oauth;

/**
 * YelpService constructor
 */
function YelpService(config) {
    var Translator = require('./YelpTranslator.js');
    var OAuth = require(config.PATH.SERVICES + 'oauth');
    var yelpConfig = require('./Config.js');

    _translator = new Translator(config);
    _oauth = new OAuth(yelpConfig);
    _YELP_SEARCH_PATH = yelpConfig.SEARCH_API_PATH;
}

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

YelpService.prototype = {

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

        params = { category_filter: YELP_CATEGORY_FILTERS, deals_filter: YELP_DEALS_FILTER };
        params.ll = lat + ',' + lon;

        console.log('YelpService: Setting up OAuth request');
        _oauth.get(_YELP_SEARCH_PATH, params, function(err, data, res) {


            console.log('YelpService: Parsing data');
            if(err) {
                defer.reject(new Error(STATUS.OAUTH_ERROR));
                return defer.promise; }

            if(typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } 
                catch(e) {
                    console.log('YelpService: ', 'error parsing data', data);
                    defer.reject(new Error(STATUS.PARSE_YELP_RESPONSE_ERROR));
                    return defer.promise; 
                }
            }

            _translator.translate(data).then(function(translated_and_categorized) {
                _success(translated_and_categorized, defer);
            }, function(error) {
                _error(error, defer);
            }, _notification);

        });

        return defer.promise;
    }
};

module.exports = YelpService;
