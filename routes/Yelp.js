module.exports = YelpRoutes = function(config) {

    var Manager = require(config.PATH.LIB + 'DataCollectorManager');
    var _manager = new Manager(config)

    var YelpService = require(config.PATH.SERVICES + 'yelp');
    var _yelpService = new YelpService(config);

    _manager.add(_yelpService.search);

    function _success(data, res) {

        var response = {},
            dataset;

        for(var i = 0, len = data.length; i < len; ++i) {
            dataset = data[i];

            for(var category in dataset) {
                if(!response.hasOwnProperty(category)) {
                    response[category] = dataset[category];
                }
                else {
                    response[category].concat(dataset[category]);
                }
            }
        }

        res.send(200, response);
    }

    function _error(error, res) {
        console.log(error);

        res.send(500, error);
    }

    function _notification(notification) {
        console.log(notification);
    }

    return {
        fetch: function(req, res) {
            console.log('Yelp: fetching');
            var lat = req.params.lat || req.body.lat,
                lon = req.params.lon || req.body.lon;

            if(!lat || !lon) {
                res.send(500, 'Yelp Routes: lat and lon are required');
                return;
            }

            var promise = _manager.delegate(lat, lon);

            promise
                .then(function(data) {
                    _success(data, res);
                }, function(error) {
                    _error(error, res);
                }, function(notification) {
                    _notification(notification);
                });    
        }
    };
};
