var Q           = require('Q'),
    querystring = require('querystring'),
    http        = require('http');

var STATUS = {};
STATUS.SELF = 'TicketflyService: ';
STATUS.PARSE_ERROR = 'Error parsing string to json';


function TicketflyService(config) {}

TicketflyService.prototype = {

    search: function(lat, lon) {
        var defer = Q.defer();

        var base_url = 'http://www.ticketfly.com';
        var service = '/api/events';
        var method = '/upcoming.json';
        var args = '?orgId=1&location=geo:38.92476163176131,-77.03218460083008';

        var options = {
            hostname: 'www.ticketfly.com',
            port: 80,
            path: service + method + args,
            method: 'GET'
        };

        var request = http.request(options, function(res) {
            var events = '';

            res.on('data', function(data) {
                events += data;
            });

            res.on('end', function() {
                try {
                    events = JSON.parse(events);
                }
                catch(e) {
                    console.log(STATUS.PARSE_ERROR, e);
                    defer.reject(new Error(STATUS.PARSE_ERROR));
                }

                if(events) {
                    defer.resolve(events);
                }
                else {
                    defer.reject(new Error(STATUS.ERROR_EXTRACTING_LAT_LON));
                }
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

