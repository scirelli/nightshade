var Q           = require('Q'),
    querystring = require('querystring'),
    http        = require('http');

var STATUS = {};
STATUS.SELF = '\n\n\nTicketflyService: ';
STATUS.PARSE_ERROR = 'Error parsing string to json';

var TicketflyConfig;

var _translator;

function TicketflyService(config) {
    var Translator = require('./TicketflyTranslator.js');

    TicketflyConfig = require('./config');
    _translator = new Translator(config);
}

/**
 * _success
 * success callback when retrieved lat:lon data from 
 * all ticketfly events 
 * @param data {Object}
 * @return null
 */
function _success(data, defer) {
    console.log(STATUS.SELF, 'success', new Date());
    defer.resolve(data);
}

/**
 * _error
 * error callback for geocoder queries
 * @param error {Object}
 * @return null
 */
function _error(error, defer) {
    console.log(STATUS.SELF, 'error', error);
    defer.reject(new Error(error));
}

/**
 * _notification
 * @param notification {Object}
 * notification callback for geocoder queries
 */
function _notification(notification) {
    console.log(STATUS.SELF, notification);
}

TicketflyService.prototype = {

    search: function(lat, lon) {
        var defer = Q.defer(),
            options = {
                hostname: TicketflyConfig.HOST,
                port: TicketflyConfig.PORT,
                method: TicketflyConfig.METHOD
            };

        options.path = TicketflyConfig.UPCOMING_EVENTS_PATH + querystring.stringify({ orgId: 1, location: 'geo:' + [lat, lon].toString()})

        console.log(STATUS.SELF + 'making following url request\n\n', options.path);

        var request = http.request(options, function(res) {
            var events = '';

            res.on('data', function(chunk) {
                events += chunk;
            });

            res.on('end', function() {
                try {
                    events = JSON.parse(events);
                }
                catch(e) {
                    console.log(STATUS.PARSE_ERROR, e);
                    defer.reject(new Error(STATUS.PARSE_ERROR));
                }

                _translator.translate(events).then(function(translated_and_categorized) {
                    _success(translated_and_categorized, defer);
                }, function(error) {
                    _error(error, defer);
                }, _notification);

            });
        });

        request.on('error', function(e) {
            console.log('error');
        });

        request.end();
        return defer.promise;
    }

};

module.exports = TicketflyService;

