module.exports = function(LocationNotifiers){
    'use strict';

    function fetch(req, res){
        var location = req.location; 
        LocationNotifiers.change(location);
    }

    return {
        fetch:fetch
    };
};
