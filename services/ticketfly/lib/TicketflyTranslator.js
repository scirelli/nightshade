var Q = require('Q');

var STATUS = {};
STATUS.SELF = '\n\n\nTicketfly: ';
STATUS.DATA_REQUIRED = STATUS.SELF + 'Supply a data list to be translated\n';
STATUS.DATA_STRUCTURE_ERROR = STATUS.SELF + 'translate expects an array for data or data.events\n';
STATUS.EMPTY_LIST = STATUS.SELF + 'empty list\n'; 


var _categorized = {
    art_ent: [],
    active: [],
    food: [],
    nightlife: [],
    other: []
};

function TicketflyTranslator(config) {
    var Geocoder = require(config.PATH.SERVICES + 'google-geocoder');
    this.geocoder = new Geocoder(config); 
}

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

function _item(translator, event) {
    var defer = Q.defer(),
        item;

    // sync operations
    item = {
        title: translator.title(event),
        description: translator.description(event),
        external_link: translator.externalLink(event),
        image_url: translator.imageUrl(event),
        categories: translator.category(event),
        metadata: translator.metadata(event)
    };

    // async operations
    translator.location(event).then(function(location) {
        if(location) {
            item.location = location;
        }
        console.log(STATUS.SELF + 'success obtaining location', item);
        _push(item);
        defer.resolve(item);
    }, function(error) {
        console.log(STATUS.SELF + 'error obtaining location, returning item without location');
        defer.resolve(item);
    }, function(notification) {
        defer.notify(notification);
    });

    return defer.promise; 
}

TicketflyTranslator.prototype = {

    /**
    * translate
    * translates data to the Common Data Schema
    * @param data - structure depends on Class implementing IDataSource
    * @return promise
    */
    translate: function(data) {
        var defer = Q.defer(),
            error,
            event;  

        // data not supplied
        if(!data) {
            error = new Error(STATUS.DATA_REQUIRED);
            console.log(error);
            defer.reject(error);
            return defer;
        }

        // supplied object
        if(typeof data === 'object') {
            // supplied object {..., events: [] } 
            if(data.hasOwnProperty('events')) {
                data = data['events'];
            }

            // not an array
            if(typeof data.length !== 'number') {
                error = new Error(STATUS.DATA_STRUCTURE_ERROR);
                console.log(error);
                defer.reject(error);
                return defer.promise;
            }
        } 
        else {
            error = new Error(STATUS.DATA_STRUCTURE_ERROR);
            console.log(error);
            defer.reject(error);
            return defer.promise;
        }

        // empty list
        if(data.length === 0) {
            console.log(STATUS.EMPTY_LIST);
            defer.resolve(_categorized);
            return defer.promise;
        }

        var promises = [];
        for(var i = 0, len = data.length; i < len; ++i) {
            event = data[i];

            promises.push(_item(this, event));
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

    /**
    * title
    */ 
    title: function(event) {
        var TITLE_KEY = 'name';

        if(event && event[TITLE_KEY]) {
            return event[TITLE_KEY];
        }
        else {
            console.log(STATUS.SELF + 'unable to get title value', event);
            return '';
        }
    },

    /**
    * description
    */
    description: function(event) {
        var DESCRIPTION_KEY = 'headlinersName';

        if(event && event[DESCRIPTION_KEY]) {
            return event[DESCRIPTION_KEY];
        }
        else {
            console.log(STATUS.SELF + 'unable to get description value', event);
            return '';
        }
    },

    /**
    * category
    */
    category: function() {
        return ['art_ent'];
    },

    /**
    * location
    */
    location: function(event) {
        var defer = Q.defer(),
            address;

        address = this.address(event);

        this.geocoder.query(address).then(function(latLon) {
            defer.resolve({
                address: address,
                lat: latLon.lat,
                lon: latLon.lon
            });
        }, defer.reject, defer.notify);

        return defer.promise;
    },

    /**
    * address
    */
    address: function(event) {
        var VENUE_KEY = 'venue',
            ADDRESS_1_FIELDS_KEY = 'address1',
            ADDRESS_2_FIELDS_KEY = 'address2',
            CITY_KEY = 'city',
            COUNTRY_KEY = 'country',
            _address,
            _addressFields,
            _city,
            _country,
            _state,
            _venue;

        if(event && event[VENUE_KEY]) {
            _venue = event[VENUE_KEY];

            _address = (_venue[ADDRESS_1_FIELDS_KEY] || '') + ' ' +
                    (_venue[ADDRESS_2_FIELDS_KEY] || '') + ' ' +
                    (_venue[CITY_KEY] && _venue[CITY_KEY].toString && _venue[CITY_KEY].toString() || '') + ' ' +
                    (_venue[COUNTRY_KEY] && _venue[COUNTRY_KEY].toString && _venue[COUNTRY_KEY].toString() || '');
            console.log(STATUS.SELF + 'combining address fields', _address);
            return _address;
            // }
        }
        else {
            console.log(STATUS.SELF + 'unable to get address', event);
            return '';
        }
    },


    /**
    * externalLink
    */
    externalLink: function(event) {
        var LINK_KEY = 'urlEventDetailsUrl';

        if(event && event[LINK_KEY]) {
            return event[LINK_KEY];
        }
        else {
            console.log(STATUS.SELF + 'unable to get external link', event);
            return '';
        }
    },

    /**
    * imageUrl
    */
    imageUrl: function(event) {
        var IMAGE_KEY = 'image',
            IMAGE_SIZE = 'squareSmall',
            IMAGE_PATH = 'path';

        if(event && event[IMAGE_KEY] && event[IMAGE_KEY][IMAGE_SIZE] && event[IMAGE_KEY][IMAGE_SIZE][IMAGE_PATH]) {
            return event[IMAGE_KEY][IMAGE_SIZE][IMAGE_PATH];
        }  
        else {
            console.log(STATUS.SELF + 'uable to get imageUrl', event);
            return '';
        }
    },

    /**
    * metadata
    */
    metadata: function(event) {
        var ID_KEY = 'id';
        var metadata = {
            source: 'ticketfly'
        };

        if(event && event[ID_KEY]) {
            metadata.source_id = event[ID_KEY];
        }

        return metadata;
    }
};

module.exports = TicketflyTranslator;