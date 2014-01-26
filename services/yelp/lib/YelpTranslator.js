var Q = require('q');

var _category_mapping = require('./categories.js');

var MESSAGE = {};
    MESSAGE.SELF = '\n\n\nYelpTranslator: ';
    MESSAGE.DATA_REQUIRED = MESSAGE.SELF + 'Supply a data list to be translated\n';
    MESSAGE.DATA_STRUCTURE_ERROR = MESSAGE.SELF + 'translate expects an array for data or data.businesses\n';
    MESSAGE.EMPTY_LIST = MESSAGE.SELF + 'empty list\n';

var YELP_BUSINESSES_KEY = 'businesses';

var _categorized = {
    art_ent: [],
    active: [],
    food: [],
    nightlife: [],
    other: []
};

function _push(item) {
    var _category;

    if(!item.categories || !item.categories.length) {
        console.log(MESSAGE.SELF + 'categories not found in item', item);
        _categorized.other.push(item); 
    }
    else {
        for(var i = 0, len = item.categories.length; i < len; ++i) {
            _category = item.categories[i];

            if(_categorized.hasOwnProperty(_category)) {
                _categorized[_category].push(item);
            }
            else {
                _categorized.other.push(item); 
            } 
        } 
    }

    return _categorized;
}

function _item(YelpTranslator, business) {
    var defer = Q.defer(),
        item;

    // sync operations
    item = {
        title: YelpTranslator.title(business),
        description: YelpTranslator.description(business),
        external_link: YelpTranslator.externalLink(business),
        image_url: YelpTranslator.imageUrl(business),
        categories: YelpTranslator.category(business),
        metadata: YelpTranslator.metadata(business)
    };

    // async operations
    YelpTranslator.location(business).then(function(location) {
        if(location) {
            item.location = location;
        }
        console.log(MESSAGE.SELF + 'success obtaining location', item);
        _push(item);
        defer.resolve(item);
    }, function(error) {
        console.log(MESSAGE.SELF + 'error obtaining location, returning item without location');
        defer.resolve(item);
    }, function(notification) {
        defer.notify(notification);
    });

    return defer.promise;
}

/*
 * Yelp Translator
 * Translate Yelp Search API response to the Common Data Schema
 * 
 * http://www.yelp.com/developers/documentation/v2/search_api#rValue
 */
function YelpTranslator(config) {
    var GoogleGeocoder = require(config.PATH.SERVICES + 'google-geocoder');
    this.geocoder = new GoogleGeocoder(config);
}

YelpTranslator.prototype = {
    /**
     * translate
     * translates yelp data to the Common Data Schema
     * @param data [{Object}, ..] | { ..., businesses: [{Object}, {Object}]}
     * @return promise
     */
    translate: function(data) {
        var defer = Q.defer(),
            error,
            business;  

        // data not supplied
        if(!data) {
            error = new Error(MESSAGE.DATA_REQUIRED);
            console.log(error);
            defer.reject(error);
            return defer;
        }

        // supplied object
        if(typeof data === 'object') {
            // supplied object {..., businesses: [] } 
            if(data.hasOwnProperty(YELP_BUSINESSES_KEY)) {
                data = data[YELP_BUSINESSES_KEY];
            }

            // not an array
            if(typeof data.length !== 'number') {
                error = new Error(MESSAGE.DATA_STRUCTURE_ERROR);
                console.log(error);
                defer.reject(error);
                return defer.promise;
            }
        } 
        else {
            error = new Error(MESSAGE.DATA_STRUCTURE_ERROR);
            console.log(error);
            defer.reject(error);
            return defer.promise;
        }

        // empty list
        if(data.length === 0) {
            console.log(MESSAGE.EMPTY_LIST);
            defer.resolve(_categorized);
            return defer.promise;
        }

        var promises = [];
        for(var i = 0, len = data.length; i < len; ++i) {
            business = data[i];

            promises.push(_item(this, business));
        }

        Q.all(promises).then(function(translated) {
            defer.resolve(_categorized);
            _categorized = {
                art_ent: [],
                active: [],
                food: [],
                nightlife: [],
                other: []
            };
        }, function(error) {
            defer.reject(error);
            _categorized = {
                art_ent: [],
                active: [],
                food: [],
                nightlife: [],
                other: []
            };
        }, function(notification) {
            defer.notify(notification);
        });

        return defer.promise;
    },

    title: function (business) {
        var TITLE_KEY = 'name';

        if(business && business[TITLE_KEY]) {
            return business[TITLE_KEY];
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get title value', business);
            return '';
        }
    },

    description: function(business) {
        var DEAL_KEY = 'deals',
            DESCRIPTION_KEY = 'title', 
            _deals,
            _description = '';

        if(business && business[DEAL_KEY]) {
            _deals = business[DEAL_KEY];

            for(var i = 0, len = _deals.length; i < len; ++i) {
                if(_deals[i][DESCRIPTION_KEY]) {
                    _description += _deals[i][DESCRIPTION_KEY];
                }
            }
            return _description;
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get description', business[DEAL_KEY]);
            return '';
        }
    },

    category: function(business) {
        var CATEGORY_KEY = 'categories',
            _categories,
            _categoryGroup,
            _alias,
            _matched,
            _assignedCategories = [];

        try{
            _categories = business[CATEGORY_KEY];

            for(var i = 0, len = _categories.length; i < len; ++i) {
                _categoryGroup = _categories[i];
                _alias = _categoryGroup[1];

                if(_category_mapping.hasOwnProperty(_alias) ) {
                    _matched = _category_mapping[_alias];

                    if( _assignedCategories.indexOf(_matched) < 0) {
                        console.log(MESSAGE.SELF + 'adding category', _matched, _assignedCategories, 'yelp categories: ', _categories);
                        _assignedCategories.push(_matched);
                    }
                    else {
                        console.log(MESSAGE.SELF + 'skipping category, already matched', _matched, _assignedCategories, 'yelp categories', _categories);
                    }
                }
            }
        }
        catch(e) {
            console.log(MESSAGE.SELF + 'unable to get categories', business[CATEGORY_KEY]);
        }

        return _assignedCategories;
    },

    location: function(business) {
        var defer = Q.defer(),
            address;

        address = this.address(business);

        this.geocoder.query(address).then(function(latLon) {
            defer.resolve({
                address: address,
                lat: latLon.lat,
                lon: latLon.lon
            });
        }, defer.reject, defer.notify);

        return defer.promise;
    },

    address: function(business) {
        var LOCATION_KEY = 'location',
            DISPLAY_ADDRESS_KEY = 'display_address',
            ADDRESS_FIELDS_KEY = 'address',
            CITY_KEY = 'city',
            COUNTRY_KEY = 'country_code',
            CROSS_STREETS_KEY = 'cross_streets',
            ZIP_KEY = 'postal_code',
            STATE_KEY = 'state_code',
            _address,
            _addressFields,
            _city,
            _country,
            _state,
            _location;

        if(business && business[LOCATION_KEY]) {
            _location = business[LOCATION_KEY];
            // if(_location[DISPLAY_ADDRESS_KEY] && _location[DISPLAY_ADDRESS_KEY].toString) {

            //     _address = business[LOCATION_KEY][DISPLAY_ADDRESS_KEY].toString();
            //     console.log(MESSAGE.SELF + 'using display address', _address);
            //     return _address;
            // }
            // else {

            _address = (_location[ADDRESS_FIELDS_KEY] && _location[ADDRESS_FIELDS_KEY][0] || '') + ' ' +
                    (_location[CITY_KEY] && _location[CITY_KEY].toString && _location[CITY_KEY].toString() || '') + ' ' +
                    (_location[STATE_KEY] && _location[STATE_KEY].toString && _location[STATE_KEY].toString() || '');
            console.log(MESSAGE.SELF + 'combining address fields', _address);
            return _address;
            // }
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get address', business);
            return '';
        }
    },

    externalLink: function(business) {
        var LINK_KEY = 'url';

        if(business && business[LINK_KEY]) {
            return business[LINK_KEY];
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get external link', business);
            return '';
        }
    },

    imageUrl: function(business) {
        var IMG_PATH_KEY = 'image_url';

        if(business && business[IMG_PATH_KEY]) {
            return business[IMG_PATH_KEY];
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get image url', business);
            return '';
        }
    },

    metadata: function(business) {
         var ID_KEY = 'id';
         var metadata = {
            source: 'yelp'
         };

         if(business && business[ID_KEY]) {
            metadata.source_id = business[ID_KEY];
         }

         return metadata;
    }
};

module.exports = YelpTranslator;
    
