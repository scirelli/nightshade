/*
 * Yelp Translator
 * Translate Yelp Search API response to the Common Data Schema
 * 
 * http://www.yelp.com/developers/documentation/v2/search_api#rValue
 */


(function(YelpTranslator) {
    module.exports = YelpTranslator();
})(function() {
    var Q = require('q'),
        geocoder = require('./GoogleGeocoder')();

    var MESSAGE = {};
    MESSAGE.SELF = '\n\n\nYelpTranslator: ';
    MESSAGE.DATA_REQUIRED = MESSAGE.SELF + 'Supply a data list to be translated\n';
    MESSAGE.DATA_STRUCTURE_ERROR = MESSAGE.SELF + 'translate expects an array for data or data.businesses\n';
    MESSAGE.EMPTY_LIST = MESSAGE.SELF + 'empty list\n';

    var YELP_BUSINESSES_KEY = 'businesses';

    var _category_mapping = {

        /* active */
        active:                 "active",
        amateursportsteam:      "active",
        amusementparks:         "active",
        aquariums:              "active",
        archery:                "active",
        badminton:              "active",
        basketballcourts:       "active",
        beaches:                "active",
        bikerentals:            "active",
        boating:                "active",
        bowling:                "active",
        challengecourses:       "active",
        climbing:               "active",
        cyclingclasses:         "active",
        discgolf:               "active",
        diving:                 "active",
        freediving:             "active",
        scuba:                  "active",
        fishing:                "active",
        fitness:                "active",
        barreclasses:           "active",
        bootcamps:              "active",
        boxing:                 "active",
        dancestudio:            "active",
        gyms:                   "active",
        martialarts:            "active",
        meditationcenters:      "active",
        pilates:                "active",
        swimminglessons:        "active",
        taichi:                 "active",
        healthtrainers:         "active",
        yoga:                   "active",
        gokarts:                "active",
        golf:                   "active",
        gun_ranges:             "active",
        gymnastics:             "active",
        hanggliding:            "active",
        horseracing:            "active",
        horsebackriding:        "active",
        hot_air_balloons:       "active",
        kiteboarding:           "active",
        lakes:                  "active",
        lasertag:               "active",
        leisure_centers:        "active",
        mini_golf:              "active",
        mountainbiking:         "active",
        paddleboarding:         "active",
        paintball:              "active",
        parks:                  "active",
        dog_parks:              "active",
        skate_parks:            "active",
        playgrounds:            "active",
        rafting:                "active",
        recreation:             "active",
        rock_climbing:          "active",
        skatingrinks:           "active",
        skydiving:              "active",
        sledding:               "active",
        football:               "active",
        sports_clubs:           "active",
        squash:                 "active",
        summer_camps:           "active",
        surfing:                "active",
        swimmingpools:          "active",
        tennis:                 "active",
        trampoline:             "active",
        tubing:                 "active",
        zoos:                   "active",

        /* arts */
        arts:                   "art_ent",
        arcades:                "art_ent",
        galleries:              "art_ent",
        gardens:                "art_ent",
        casinos:                "art_ent",
        movietheaters:          "art_ent",
        culturalcenter:         "art_ent",
        festivals:              "art_ent",
        jazzandblues:           "art_ent",
        museums:                "art_ent",
        musicvenues:            "art_ent",
        opera:                  "art_ent",
        theater:                "art_ent",
        sportsteams:            "art_ent",
        psychic_astrology:      "art_ent",
        racetracks:             "art_ent",
        social_clubs:           "art_ent",
        stadiumsarenas:         "art_ent",
        ticketsales:            "art_ent",
        wineries:               "art_ent",

        /* food */
        food:                   "food",
        bagels:                 "food",
        bakeries:               "food",
        beer_and_wine:          "food",
        breweries:              "food",
        bubbletea:              "food",
        butcher:                "food",
        csa:                    "food",
        coffee:                 "food",
        convenience:            "food",
        cupcakes:               "food",
        desserts:               "food",
        diyfood:                "food",
        donuts:                 "food",
        farmersmarket:          "food",
        fooddeliveryservices:   "food",
        foodtrucks:             "food",
        gelato:                 "food",
        grocery:                "food",
        icecream:               "food",
        internetcafe:           "food",
        juicebars:              "food",
        pretzels:               "food",
        shavedice:              "food",
        gourmet:                "food",
        candy:                  "food",
        cheese:                 "food",
        chocolate:              "food",
        ethnicmarkets:          "food",
        markets:                "food",
        healthmarkets:          "food",
        herbsandspices:         "food",
        meats:                  "food",
        seafoodmarkets:         "food",
        healthmarkets:          "food",
        streetvendors:          "food",
        tea:                    "food",
        wineries:               "food",
        yelpevents:             "food", 

        /* night life */
        nightlife:              "nightlife",
        adultentertainment:     "nightlife",
        bars:                   "nightlife",
        champagne_bars:         "nightlife",
        cocktailbars:           "nightlife",
        divebars:               "nightlife",
        gaybars:                "nightlife",
        hookah_bars:            "nightlife",
        lounges:                "nightlife",
        pubs:                   "nightlife",
        sportsbars:             "nightlife",
        wine_bars:              "nightlife",
        comedyclubs:            "nightlife",
        countrydancehalls:      "nightlife",
        danceclubs:             "nightlife",
        jazzandblues:           "nightlife",
        karaoke:                "nightlife",
        musicvenues:            "nightlife",
        pianobars:              "nightlife",
        poolhalls:              "nightlife"
    } 

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
            _categorized['other'].push(item); 
        }
        else {
            for(var i = 0, len = item.categories.length; i < len; ++i) {
                _category = item.categories[i];

                if(_categorized.hasOwnProperty(_category)) {
                    _categorized[_category].push(item);
                }
                else {

                    _categorized['other'].push(item);
                } 
            } 
        }

        return _categorized;
    }

    function _item(business) {
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
            defer.resolve(item)
        }, function(error) {
            console.log(MESSAGE.SELF + 'error obtaining location, returning item without location');
            defer.resolve(item);
        }, function(notification) {
            defer.notify(notification);
        })

        return defer.promise;
    }

    function YelpTranslator() {
        console.log(MESSAGE.SELF + 'created on ', new Date());
    };

    /**
     * translate
     * translates yelp data to the Common Data Schema
     * @param data [{Object}, ..] | { ..., businesses: [{Object}, {Object}]}
     * @return promise
     */
    YelpTranslator.translate = translate;
    function translate(data) {
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

            promises.push(_item(business))
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
    }

    YelpTranslator.title = title;
    function title(business) {
        var TITLE_KEY = 'name';

        if(business && business[TITLE_KEY]) {
            return business[TITLE_KEY]
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get title value', business);
            return '';
        }
    }

    YelpTranslator.description = description;
    function description(business) {
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
    }

    YelpTranslator.category = category;
    function category(business) {
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
                _alias = _categoryGroup[1]

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
    }

    YelpTranslator.location = location;
    function location(business) {
        var defer = Q.defer(),
            address;

        address = YelpTranslator.address(business);

        geocoder.query(address).then(function(latLon) {
            defer.resolve({
                address: address,
                lat: latLon.lat,
                lon: latLon.lon
            });
        }, defer.reject, defer.notify);

        return defer.promise;
    }

    YelpTranslator.address = address;
    function address(business) {
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

            _address = (_location[ADDRESS_FIELDS_KEY] && _location[ADDRESS_FIELDS_KEY][0] || '') + ' '
                    +  (_location[CITY_KEY] && _location[CITY_KEY].toString && _location[CITY_KEY].toString() || '') + ' '
                    + (_location[STATE_KEY] && _location[STATE_KEY].toString && _location[STATE_KEY].toString() || '');
            console.log(MESSAGE.SELF + 'combining address fields', _address);
            return _address;
            // }
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get address', business);
            return '';
        }
    }

    YelpTranslator.externalLink = externalLink;
    function externalLink(business) {
        var LINK_KEY = 'url';

        if(business && business[LINK_KEY]) {
            return business[LINK_KEY];
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get external link', business);
            return '';
        }
    }

    YelpTranslator.imageUrl = imageUrl;
    function imageUrl(business) {
        var IMG_PATH_KEY = 'image_url';

        if(business && business[IMG_PATH_KEY]) {
            return business[IMG_PATH_KEY];
        }
        else {
            console.log(MESSAGE.SELF + 'unable to get image url', business);
            return '';
        }
    }

    YelpTranslator.metadata = metadata;
    function metadata(business) {
         var ID_KEY = 'id';
         var metadata = {
            source: 'yelp'
         };

         console.log(MESSAGE.SELF, business.id, business);
         if(business && business[ID_KEY]) {
            metadata.source_id = business[ID_KEY];
         }

         return metadata;
    }


    return YelpTranslator;
})
    
