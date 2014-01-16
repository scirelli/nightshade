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
        arts:                   "arts",
        arcades:                "arts",
        galleries:              "arts",
        gardens:                "arts",
        casinos:                "arts",
        movietheaters:          "arts",
        culturalcenter:         "arts",
        festivals:              "arts",
        jazzandblues:           "arts",
        museums:                "arts",
        musicvenues:            "arts",
        opera:                  "arts",
        theater:                "arts",
        sportsteams:            "arts",
        psychic_astrology:      "arts",
        racetracks:             "arts",
        social_clubs:           "arts",
        stadiumsarenas:         "arts",
        ticketsales:            "arts",
        wineries:               "arts",

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

    function _item(business) {
        var defer = Q.defer(),
            item;

        // sync operations
        item = {
            title: YelpTranslator.title(business),
            description: YelpTranslator.description(business),
            external_link: YelpTranslator.externalLink(business),
            image_url: YelpTranslator.imageUrl(business)
        };

        // async operations
        YelpTranslator.location(business).then(function(location) {
            if(location) {
                item.location = location;
            }
            console.log(MESSAGE.SELF + 'success obtaining location', item);
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
            business,
            collection = {
                art_ent: [],
                active: [],
                food: [],
                nightlife: [],
                other: []
            };  

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
            if(!data.length) {
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
            defer.resolve(data);
            return defer.promise;
        }

        var promises = [];
        for(var i = 0, len = data.length; i < len; ++i) {
            business = data[i];

            promises.push(_item(business))
        }

        Q.all(promises).then(function(categorized) {
            defer.resolve(categorized);
        }, function(error) {
            defer.reject(error);
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


    return YelpTranslator;
})
    

/*

    function _address(business) {
        
    }

*/

/*

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
    }, function(notification) {
        _notification(notification);
    });
}
else {
    defer.resolve([]);
}


Example Business Data Structure
===============================

{
    "rating": 3.5,
    "rating_img_url": "http://s3-media1.ak.yelpcdn.com/assets/2/www/img/5ef3eb3cb162/ico/stars/v1/stars_3_half.png",
    "display_phone": "+1-202-265-3413",
    "id": "duffys-irish-restaurant-and-pub-washington",
    "is_closed": false,
    "mobile_url": "http://m.yelp.com/biz/duffys-irish-restaurant-and-pub-washington",
    "review_count": 113,
    "categories": [
      [
        "Pubs",
        "pubs"
      ],
      [
        "Sports Bars",
        "sportsbars"
      ],
      [
        "Irish",
        "irish"
      ]
    ],
    "location": {
      "cross_streets": "N Florida Ave & N V St",
      "city": "Washington",
      "display_address": [
        "2106 Vermont Ave NW",
        "(b/t N Florida Ave & N V St)",
        "Washington, DC 20001"
      ],
      "postal_code": "20001",
      "country_code": "US",
      "address": [
        "2106 Vermont Ave NW"
      ],
      "state_code": "DC"
    },
    "is_claimed": true,
    "rating_img_url_small": "http://s3-media1.ak.yelpcdn.com/assets/2/www/img/2e909d5d3536/ico/stars/v1/stars_small_3_half.png",
    "phone": "2022653413",
    "snippet_text": "We got there around 6pm on Tuesday night, which happens to be half off wing night #win. You walk right in and sit yourself anywhere to your liking. Our...",
    "rating_img_url_large": "http://s3-media3.ak.yelpcdn.com/assets/2/www/img/bd9b7a815d1b/ico/stars/v1/stars_large_3_half.png",
    "snippet_image_url": "http://s3-media4.ak.yelpcdn.com/photo/gUqgzcU_f-jjRxzHWkBDjQ/ms.jpg",
    "distance": 951.4453075439014,
    "name": "Duffy's Irish Restaurant & Pub",
    "url": "http://www.yelp.com/biz/duffys-irish-restaurant-and-pub-washington",
    "deals": [
      {
        "is_popular": true,
        "what_you_get": "You get a voucher redeemable for $20 at Duffy's Irish Restaurant & Pub.\nPrint out your voucher, or redeem on your phone with the <a href=\"http://www.yelp.com/yelpmobile\">Yelp app</a>.",
        "time_start": 1386801529,
        "title": "$10 for $20",
        "url": "http://www.yelp.com/deals/duffys-irish-restaurant-and-pub-washington",
        "additional_restrictions": "Promotion lasts for 1 year from date of purchase. After that period, your voucher is redeemable for the amount you paid. Not valid with other vouchers, certificates, or offers. Gratuity not included; please tip on full value. Must be of legal drinking age. Must use in a single visit. Only 1 voucher(s) can be purchased and redeemed per person. Up to 1 can be purchased as gifts for others. Subject to the <a target=\"_blank\" href=\"http://www.yelp.com/tos/general_b2c_us_20120911\">General Terms</a>.",
        "options": [
          {
            "original_price": 2000,
            "title": "$10 for $20",
            "price": 1000,
            "purchase_url": "https://www.yelp.com/checkout/deal/mF09EL6FRiwf6UnWOi2FRw",
            "remaining_count": 188,
            "formatted_original_price": "$20",
            "formatted_price": "$10",
            "is_quantity_limited": true
          }
        ],
        "important_restrictions": "Not valid for delivery.\nNot valid for take-out.\nLimit 1 voucher(s) per table.",
        "image_url": "http://s3-media4.ak.yelpcdn.com/dphoto/Vsz2jEgS5kc-_rosvDIwRA/m.jpg",
        "id": "1zb43yF-NzjYNibrBcWM3Q",
        "currency_code": "USD"
      }
    ],
    "image_url": "http://s3-media1.ak.yelpcdn.com/bphoto/4gu2uQ5ONLKgtnDmtDl2dw/ms.jpg",
    "menu_provider": "singleplatform",
    "menu_date_updated": 1387633248
}
*/  

