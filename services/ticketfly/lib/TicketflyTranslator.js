var Q = require('Q');

var STATUS = {};
STATUS.SELF = '\n\n\nTicketfly: ';
STATUS.DATA_REQUIRED = STATUS.SELF + 'Supply a data list to be translated\n';
STATUS.DATA_STRUCTURE_ERROR = STATUS.SELF + 'translate expects an array for data or data.events\n';
STATUS.EMPTY_LIST = STATUS.SELF + 'empty list\n'; 

function TicketflyTranslator(config) {
    var Geocoder = require(config.PATH.SERVICES + 'GoogleGeocoder');
    this.geocoder = new Geocoder(config); 
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
            // supplied object {..., businesses: [] } 
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
    title: function(id) {},

    /**
    * description
    */
    description: function() {},

    /**
    * category
    */
    category: function() {},

    /**
    * location
    */
    location: function() {},

    /**
    * address
    */
    address: function() {},


    /**
    * externalLink
    */
    externalLink: function() {},

    /**
    * imageUrl
    */
    imageUrl: function() {},

    /**
    * metadata
    */
    metadata: function() {}
}