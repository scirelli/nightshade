module.exports = YelpRoutes = function(YelpService) {

    function _success(data, res) {
        res.send(200, data);
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

            var promise = YelpService.search(lat, lon);

            console.log(promise);

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
}
